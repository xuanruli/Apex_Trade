import React, { useState, useEffect } from 'react';

const TradeSidebar = ({ tradeable, isVisible, onClose }) => {
    const [orderType, setOrderType] = useState('buy'); // 'buy' or 'sell'
    const [tradeOrderType, setTradeOrderType] = useState('market'); // 'market' or 'limit'
    const [quantity, setQuantity] = useState(1);
    const [limitPrice, setLimitPrice] = useState(tradeable?.currentPrice || 0);
    const [error, setError] = useState('');
    
    useEffect(() => {
        // Update price when the selected tradeable asset changes
        setLimitPrice(tradeable?.currentPrice || 0);
        setQuantity(1); // Reset quantity
    }, [tradeable]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        // ... trading logic from trade.js ...
        const price = tradeOrderType === 'market' ? tradeable.currentPrice : limitPrice;

        const response = await fetch('http://localhost:5000/api/trade', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                symbol: tradeable.symbol,
                actionType: orderType,
                quantity: quantity,
                orderType: tradeOrderType,
                price: price
             })
        });

        const data = await response.json();
        if (data.success) {
            onClose();
            window.location.reload(); // Or ideally, update state without reload
        } else {
            setError(data.message || 'Trade failed');
        }
    };

    if (!isVisible || !tradeable) {
        return null;
    }

    const estimatedTotal = (quantity * (tradeOrderType === 'market' ? tradeable.currentPrice : limitPrice)).toFixed(2);

    return (
        <>
            <div className="page-overlay active" onClick={onClose}></div>
            <div id="tradeSidebar" className="active">
                <div className="sidebar-header">
                    <h3>Place Order</h3>
                    <button className="close-sidebar-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="sidebar-content">
                    <h4>{tradeable.symbol}</h4>
                    <p>Current Price: ${tradeable.currentPrice.toFixed(2)}</p>
                    <p>Your Holdings: {tradeable.currentShares} shares</p>

                    {error && <div id="tradeSidebarAlert" className="alert alert-danger">{error}</div>}

                    <form id="tradeForm" onSubmit={handlePlaceOrder}>
                        <div className="order-type-selector">
                            <button type="button" className={`order-type-btn ${orderType === 'buy' ? 'active' : ''}`} onClick={() => setOrderType('buy')}>Buy</button>
                            <button type="button" className={`order-type-btn ${orderType === 'sell' ? 'active' : ''}`} onClick={() => setOrderType('sell')}>Sell</button>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="tradeQuantity">Quantity</label>
                            <input type="number" id="tradeQuantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="1" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tradeOrderType">Order Type</label>
                            <select id="tradeOrderType" value={tradeOrderType} onChange={(e) => setTradeOrderType(e.target.value)}>
                                <option value="market">Market</option>
                                <option value="limit">Limit</option>
                            </select>
                        </div>

                        {tradeOrderType === 'limit' && (
                            <div className="form-group" id="tradePriceInput">
                                <label htmlFor="tradePrice">Price</label>
                                <input type="number" id="tradePrice" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} />
                            </div>
                        )}
                        
                        <div className="estimated-total">
                            <span>Estimated Total:</span>
                            <span id="tradeTotalPrice">${estimatedTotal}</span>
                        </div>
                        
                        <button type="submit" id="place-order-btn" className={`btn-place-order ${orderType}`}>
                            Place {orderType.charAt(0).toUpperCase() + orderType.slice(1)} Order
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TradeSidebar; 