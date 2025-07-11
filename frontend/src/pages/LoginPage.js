import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.data.user); // Update global state
                navigate(from, { replace: true }); // Redirect to originally intended page
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Welcome back</h1>
                <p className="login-subtitle">Enter your credentials to access your account</p>
                
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            className="form-control" 
                            placeholder="User login" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="••••••••" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    
                    <button type="submit" className="login-button">Login</button>
                </form>

                <div className="oauth-divider">
                    <span>Or</span>
                </div>

                <a href="http://localhost:5000/api/login/google" className="google-login-button">
                    <i className="fab fa-google"></i> Sign in with Google
                </a>

                <p className="signup-prompt">
                     Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage; 