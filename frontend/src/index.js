import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SignInForm from './pages/SignInForm/SignInForm';
import SignUpForm from './pages/SignUpForm/SignUpForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import './App.css';

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('coachToken'));
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = () => {
    const authStatus = !!localStorage.getItem('coachToken');
    setIsAuthenticated(authStatus);
    setIsLoading(false);
    return authStatus;
  };

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Custom storage event handler for cross-tab sync
    const handleStorageChange = (e) => {
      if (e.key === 'coachToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle successful login
  const handleLogin = () => {
    localStorage.setItem('coachToken', true); // Actual token would be set in SignInForm
    checkAuth();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('coachToken');
    localStorage.removeItem('coachName');
    checkAuth();
  };

  if (isLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <header className="app-header">
          <nav className="navbar">
            <h1>Fitness Management</h1>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              {!isAuthenticated ? (
                <>
                  <li><Link to="/signin" className="nav-link">Sign In</Link></li>
                  <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
                </>
              ) : (
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              )}
            </ul>
          </nav>
        </header>

        {/* Page Routing */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/signin" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignInForm onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignUpForm onSignup={handleLogin} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/signin" replace />
                )
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 Fitness Management. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();