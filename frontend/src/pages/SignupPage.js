import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        
        const response = await fetch('http://localhost:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData)
        });
        
        const data = await response.json();

        if (response.ok) {
            setSuccess('Registration successful! Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(data.message || 'Registration failed.');
            setSuccess('');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h1 className="signup-title">Create your account</h1>
                <p className="signup-subtitle">Join thousands of investors tracking the market</p>
                
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Form fields */}
                    <input type="text" name="firstname" placeholder="First Name" required onChange={handleChange} className="form-control mb-2" />
                    <input type="text" name="lastname" placeholder="Last Name" required onChange={handleChange} className="form-control mb-2" />
                    <input type="text" name="username" placeholder="Username" required onChange={handleChange} className="form-control mb-2" />
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="form-control mb-2" />
                    <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="form-control mb-2" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} className="form-control mb-2" />
                    
                    <button type="submit" className="signup-button">Create Account</button>
                </form>

                <p className="login-prompt mt-3">
                    Already have an account? <a href="/login" className="login-link">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignupPage; 