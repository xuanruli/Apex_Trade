import React, { useState } from 'react';

const ReportPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendReport = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const response = await fetch('http://localhost:5000/api/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.success) {
            setMessage(data.data.message);
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Send Portfolio Report</h1>
            <p>Enter your email address to receive a PDF copy of your portfolio analysis.</p>
            <form onSubmit={handleSendReport}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email"
                        className="form-control" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">Send Report</button>
            </form>
            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
};

export default ReportPage; 