import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssetsPage from './pages/AssetsPage';
import NewsPage from './pages/NewsPage';
import PortfolioPage from './pages/PortfolioPage';
import AdminPage from './pages/AdminPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoricalPage from './pages/HistoricalPage';
import ReportPage from './pages/ReportPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/news" element={<NewsPage />} />

              {/* Protected Routes */}
              <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
              <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
              <Route path="/historical" element={<ProtectedRoute><HistoricalPage /></ProtectedRoute>} />
              <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
              
              {/* Admin Route */}
              <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// A special protected route just for admins
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user && user.is_admin) {
    return children;
  }
  return <Navigate to="/" />;
}

export default App;
