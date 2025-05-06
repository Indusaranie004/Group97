import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
import SignInForm from './pages/SignInForm/SignInForm';
import SignUpForm from './pages/SignUpForm/SignUpForm';
import CoachSignInForm from './pages/CoachSignInForm/CoachSignInForm';
import CoachSignUpForm from './pages/CoachSignUpForm/CoachSignUpForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('coachToken'));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!localStorage.getItem('userToken'));

  // Handle logout function
  const handleLogout = (userType) => {
    if (userType === 'coach') {
      localStorage.removeItem('coachToken');
      localStorage.removeItem('coachName');
      localStorage.removeItem('coachEmail');
      setIsAuthenticated(false);
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      setIsUserAuthenticated(false);
    }
  };

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('coachToken'));
      setIsUserAuthenticated(!!localStorage.getItem('userToken'));
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
            <ul className="nav-links">
              <li><Link to="/" className="nav-link">Home</Link></li>
              
              {/* Show auth links only when not authenticated */}
              {!isAuthenticated && !isUserAuthenticated && (
                <>
                  <li><Link to="/signin" className="nav-link">User Sign In</Link></li>
                  <li><Link to="/signup" className="nav-link">User Sign Up</Link></li>
                  <li><Link to="/coach/signin" className="nav-link">Coach Sign In</Link></li>
                  <li><Link to="/coach/signup" className="nav-link">Coach Sign Up</Link></li>
                </>
              )}

              {/* Show dashboard link when authenticated */}
              {(isAuthenticated || isUserAuthenticated) && (
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              )}

              {/* Show logout button when authenticated */}
              {(isAuthenticated || isUserAuthenticated) && (
                <li>
                  <button 
                    className="logout-btn"
                    onClick={() => handleLogout(isAuthenticated ? 'coach' : 'user')}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>

        {/* Page Routing */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* User authentication routes */}
            <Route 
              path="/signin" 
              element={
                isUserAuthenticated || isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignInForm 
                    onLogin={() => setIsUserAuthenticated(true)} 
                  />
                )
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                isUserAuthenticated || isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignUpForm 
                    onSignup={() => setIsUserAuthenticated(true)} 
                  />
                )
              } 
            />
            
            {/* Coach authentication routes */}
            <Route 
              path="/coach/signin" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <CoachSignInForm 
                    onLogin={() => setIsAuthenticated(true)} 
                  />
                )
              } 
            />
            
            <Route 
              path="/coach/signup" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <CoachSignUpForm 
                    onSignup={() => setIsAuthenticated(true)} 
                  />
                )
              } 
            />
            
            {/* Dashboard route */}
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated || isUserAuthenticated ? (
                  <Dashboard 
                    onLogout={() => handleLogout(isAuthenticated ? 'coach' : 'user')} 
                    isCoach={isAuthenticated}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
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