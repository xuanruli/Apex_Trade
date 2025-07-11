import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPage = () => {
    const [dashboardData, setDashboardData] = useState({ users: [], transactions: [], portfolios: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/dashboard');
                const data = await response.json();
                if (data.success) {
                    setDashboardData(data.data);
                } else {
                    setError(data.message || 'Failed to fetch admin data.');
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) {
            fetchData();
        }
    }, [user]);

    if (loading) return <div>Loading Admin Dashboard...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <table className="table">
                        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Name</th></tr></thead>
                        <tbody>
                            {dashboardData.users.map(u => <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.firstname} {u.lastname}</td></tr>)}
                        </tbody>
                    </table>
                );
            case 'transactions':
                return (
                     <table className="table">
                        <thead><tr><th>ID</th><th>User ID</th><th>Symbol</th><th>Shares</th><th>Price</th><th>Type</th><th>Date</th></tr></thead>
                        <tbody>
                            {dashboardData.transactions.map(t => <tr key={t.id}><td>{t.id}</td><td>{t.user_id}</td><td>{t.stock_symbol}</td><td>{t.shares}</td><td>{t.price_per_share}</td><td>{t.transaction_type}</td><td>{t.transaction_date}</td></tr>)}
                        </tbody>
                    </table>
                );
            case 'portfolios':
                return (
                     <table className="table">
                        <thead><tr><th>ID</th><th>User ID</th><th>Symbol</th><th>Shares</th><th>Cost Basis</th></tr></thead>
                        <tbody>
                            {dashboardData.portfolios.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.user_id}</td><td>{p.stock_symbol}</td><td>{p.total_shares}</td><td>{p.cost_basis}</td></tr>)}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mt-4">
            <h1>Admin Dashboard</h1>
            <ul className="nav nav-tabs">
                <li className="nav-item"><button className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button></li>
                <li className="nav-item"><button className={`nav-link ${activeTab === 'portfolios' ? 'active' : ''}`} onClick={() => setActiveTab('portfolios')}>Portfolios</button></li>
            </ul>
            <div className="tab-content mt-3">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPage; 