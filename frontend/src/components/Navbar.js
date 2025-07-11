import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link className="navbar-brand" to="/">
                    <img src="/Logo1.png" alt="Company Logo" style={{ height: '40px' }} />
                    <span>Apex Trading</span>
                </Link>
                <div className="navbar-menu">
                    <Link to="/assets">Assets</Link>
                    <Link to="/news">News</Link>
                    {user && (
                        <>
                            <Link to="/portfolio">Portfolio</Link>
                            <Link to="/analysis">Analysis</Link>
                            <Link to="/historical">History</Link>
                            <Link to="/report">Report</Link>
                        </>
                    )}
                    {user && user.is_admin && <Link to="/admin">Admin</Link>}
                </div>
                <div className="search-container">
                    <form className="search-form" action="/assets">
                        <input type="text" name="symbol" placeholder="Search symbol or site..." className="search-input" />
                    </form>
                </div>
            </div>
            <div className="navbar-buttons">
                {user ? (
                    <>
                        <span className="welcome-text">
                            <Link to="/portfolio">{user.username}</Link>
                        </span>
                        <button onClick={handleLogout} className="btn-signup">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn-login">Login</Link>
                        <Link to="/signup" className="btn-signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 