from flask import Blueprint, request, jsonify, session
from app.logger import logger
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.models.asset import Asset
from app.services.auth import verify_exist, authorize_user
from app.services.news import get_recent_stock_news
from app.services.chart import load_asset_page
from datetime import datetime
from flask_mail import Message
from weasyprint import HTML
from validate_email import validate_email
import pandas as pd
import numpy as np

api_bp = Blueprint('api', __name__)


@api_bp.route('/session', methods=['GET'])
def get_session():
    if 'id' in session:
        return jsonify({
            'success': True,
            'data': {
                'logged_in': True,
                'user': {
                    'id': session['id'],
                    'username': session.get('username'),
                    'name': session.get('name'),
                    'is_admin': session.get('username') == 'apex_admin'
                }
            }
        })
    else:
        return jsonify({'success': True, 'data': {'logged_in': False}})


@api_bp.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    if not authorize_user(username, password):
        return jsonify({
            'success': False,
            'message': 'Username does not exist or password does not match.'
        }), 401

    user = User.get_by_username(username)
    session['id'] = user['id']
    session['username'] = username
    session['name'] = str(user['firstname']) + " " + str(user['lastname'])

    return jsonify({
        'success': True,
        'data': {
            'message': 'Login successful!',
            'user': {
                'id': user['id'],
                'username': user['username'],
                'name': session['name'],
                'is_admin': user['username'] == 'apex_admin'
            }
        }
    })

@api_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({
        'success': True,
        'data': {'message': 'You have been logged out.'}
    })


@api_bp.route('/signup', methods=['POST'])
def register():
    # Assumes request body is x-www-form-urlencoded
    username = request.form.get('username')
    email = request.form.get('email')
    password = request.form.get('password')
    firstname = request.form.get('firstname')
    lastname = request.form.get('lastname')

    if verify_exist(username, email):
        return jsonify({
            'success': False,
            'message': 'Username or email already exists.'
        }), 409

    User(username, email, firstname, lastname, password).save()

    return jsonify({
        'success': True,
        'data': {'message': 'Registration successful! Please login.'}
    }), 201

@api_bp.route('/asset', methods=['GET'])
def asset():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'success': False, 'message': 'Stock symbol is required.'}), 400

    stock, candlestick_chart, line_chart, bar_chart, titles, urls, start_date, end_date = load_asset_page()

    if stock is None:
        return jsonify({'success': False, 'message': f'No data found for symbol: {symbol}'}), 404

    return jsonify({
        'success': True,
        'data': {
            'stock': stock,
            'charts': {
                'candlestick': candlestick_chart,
                'line': line_chart,
                'bar': bar_chart,
            },
            'news': {'titles': titles, 'urls': urls},
            'date_range': {'start': start_date, 'end': end_date}
        }
    })


@api_bp.route('/trade', methods=['POST'])
def trade():
    if 'id' not in session:
        return jsonify({"success": False, "message": "Please log in to trade."}), 401

    data = request.get_json()
    symbol = data.get('symbol')
    action_type = data.get('actionType')
    quantity = int(data.get('quantity'))
    price = float(data.get('price'))
    user_id = session['id']

    Transaction(user_id, symbol, quantity, price, action_type, datetime.now()).save()
    portfolio = Portfolio.get_by_user_id(user_id)

    if portfolio.update_portfolio(symbol, quantity, price, action_type.lower()):
        message = f"Order to {action_type} {quantity} shares of {symbol} was successful!"
        return jsonify({'success': True, 'data': {'message': message}})
    else:
        message = f"Failed to update portfolio for trade: {action_type} {quantity} of {symbol}."
        return jsonify({'success': False, 'message': message}), 500


@api_bp.route('/portfolio', methods=['GET'])
def portfolio():
    if 'id' not in session:
        return jsonify({'success': False, 'message': 'Please log in to view your portfolio.'}), 401

    user_id = session.get('id')
    portfolio_instance = Portfolio.get_by_user_id(user_id)
    holdings = portfolio_instance.get_holding_summary()

    return jsonify({'success': True, 'data': {'holdings': holdings}})


@api_bp.route('/news', methods=['GET'])
def news():
    try:
        articles = get_recent_stock_news(count=20)
        return jsonify({'success': True, 'data': {'articles': articles}})
    except Exception as e:
        logger.error(f"[NEWS] Failed to fetch news: {e}")
        return jsonify({'success': False, 'message': 'Failed to fetch news articles.'}), 500


@api_bp.route('/analysis', methods=['GET'])
def analysis():
    if 'id' not in session:
        return jsonify({'success': False, 'message': 'Please log in to view analysis.'}), 401

    try:
        user_id = session['id']
        ef_data = ef_draw()
        pie_data = pie_chart(user_id)
        return jsonify({
            'success': True,
            'data': {'efficient_frontier': ef_data, 'pie_chart': pie_data}
        })
    except Exception as e:
        logger.error(f"[ANALYSIS] Failed to generate analysis: {e}")
        return jsonify({'success': False, 'message': 'Failed to generate portfolio analysis.'}), 500


def ef_draw():
    portfolio = pd.DataFrame(Portfolio.get_all_portfolios())
    portfolio_symbols = portfolio['stock_symbol'].unique()
    price_df = Asset.get_one_year_price_db(portfolio_symbols)
    returns = price_df.pct_change().dropna()
    expected_returns = returns.mean() * 252
    cov_matrix = returns.cov() * 252
    risk_free_rate = 0.0423
    for symbol in expected_returns.index:
        if expected_returns[symbol] < risk_free_rate:
            expected_returns[symbol] = risk_free_rate + 0.01
    return {
        'symbols': expected_returns.index.tolist(),
        'returns': expected_returns.values.tolist(),
        'covariance': cov_matrix.values.tolist(),
        'risk_free_rate': risk_free_rate
    }

def pie_chart(user_id):
    portfolio = Portfolio.get_by_user_id(user_id)
    holdings_data = portfolio.get_holding_summary()
    return {
        'symbols': [item['symbol'] for item in holdings_data],
        'market_values': [item['market_value'] for item in holdings_data],
        'holdings': holdings_data
    }


@api_bp.route('/historical', methods=['GET'])
def historical():
    if 'id' not in session:
        return jsonify({'success': False, 'message': 'Please log in to view transaction history.'}), 401
    
    user_id = session.get('id')
    transactions = Transaction.get_all_transactions(user_id)
    return jsonify({'success': True, 'data': {'transactions': transactions}})


@api_bp.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    if session.get('username') != "apex_admin":
        return jsonify({'success': False, 'message': 'Forbidden: Admins only.'}), 403

    users = User.get_all_users()
    transactions = Transaction.get_all_user_transactions()
    portfolios = Portfolio.get_all_portfolios()

    return jsonify({
        'success': True,
        'data': {'users': users, 'transactions': transactions, 'portfolios': portfolios}
    })


@api_bp.route('/admin/change-password', methods=['POST'])
def change_password():
    if session.get('username') != "apex_admin":
        return jsonify({'success': False, 'message': 'Forbidden: Admins only.'}), 403

    data = request.get_json()
    User.change_password(data.get('user_id'), data.get('new_password'))
    return jsonify({'success': True, 'data': {'message': 'Password changed successfully!'}})


@api_bp.route('/admin/delete', methods=['POST'])
def delete_user():
    if session.get('username') != "apex_admin":
        return jsonify({'success': False, 'message': 'Forbidden: Admins only.'}), 403
    
    data = request.get_json()
    if data.get('username') == 'apex_admin':
        return jsonify({'success': False, 'message': 'Admin account cannot be deleted.'}), 400
    
    User.delete_user(data.get('user_id'))
    return jsonify({'success': True, 'data': {'message': f"User {data.get('username')} deleted."}})


@api_bp.route('/report', methods=['POST'])
def report():
    if 'id' not in session:
        return jsonify({'success': False, 'message': 'Please log in to generate a report.'}), 401

    email = request.json.get('email')
    if not email or not validate_email(email):
        return jsonify({'success': False, 'message': 'A valid email address is required.'}), 400

    from app import mail
    from flask import render_template # Keep local import for this specific use case
    try:
        user_id = session['id']
        name = session['name']
        ef_data, chart_data = ef_draw(), pie_chart(user_id)
        
        rendered_html = render_template('analysis_pdf.html', data=ef_data, chart_data=chart_data)
        pdf_file = HTML(string=rendered_html, base_url=request.url_root).write_pdf()
        
        msg = Message('Your Apex Trading Portfolio Report', recipients=[email])
        msg.body = f"Dear {name},\n\nPlease find your attached portfolio analysis report."
        msg.attach('Apex_analysis.pdf', 'application/pdf', pdf_file)
        mail.send(msg)
        
        return jsonify({'success': True, 'data': {'message': 'Report sent successfully!'}})
    except Exception as e:
        logger.error(f"[REPORT] Failed to send report: {e}")
        return jsonify({'success': False, 'message': 'Failed to send the report.'}), 500


@api_bp.route("/crash")
def crash():
    return 1 / 0

