import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for user session on initial load
        const fetchSession = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/session');
                const data = await response.json();
                if (data.success && data.data.logged_in) {
                    setUser(data.data.user);
                }
            } catch (error) {
                console.error("Could not fetch user session:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:5000/api/logout', { method: 'POST' });
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const value = { user, loading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
}; 