import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import SignInForm from './pages/SignInForm/SignInForm';
import SignUpForm from './pages/SignUpForm/SignUpForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('coachToken'));

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('coachToken'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <header className="app-header">
          <nav className="navbar">
            <h1>Fitness Management</h1>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              {!isAuthenticated && (
                <>
                  <li><Link to="/signin" className="nav-link">Sign In</Link></li>
                  <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
                </>
              )}
              {isAuthenticated && (
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
                  <Navigate to="/dashboard" />
                ) : (
                  <SignInForm onLogin={() => setIsAuthenticated(true)} />
                )
              } 
            />
            <Route 
              path="/signup" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <SignUpForm onSignup={() => setIsAuthenticated(true)} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={() => setIsAuthenticated(false)} />
                ) : (
                  <Navigate to="/signin" />
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
}

export default App;