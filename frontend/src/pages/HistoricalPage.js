import React, { useState, useEffect } from 'react';

const HistoricalPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const response = await fetch('http://localhost:5000/api/historical');
            const data = await response.json();
            if (data.success) setTransactions(data.data.transactions);
            setLoading(false);
        };
        fetchHistory();
    }, []);

    if (loading) return <div>Loading transaction history...</div>;

    return (
        <div className="container mt-4">
            <h1>Transaction History</h1>
            <table className="table">
                <thead><tr><th>Date</th><th>Symbol</th><th>Type</th><th>Shares</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                    {transactions.map((tx, index) => (
                        <tr key={index}>
                            <td>{new Date(tx.transaction_date).toLocaleDateString()}</td>
                            <td>{tx.stock_symbol}</td>
                            <td>{tx.transaction_type}</td>
                            <td>{tx.shares}</td>
                            <td>${tx.price.toFixed(2)}</td>
                            <td>${tx.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoricalPage; 