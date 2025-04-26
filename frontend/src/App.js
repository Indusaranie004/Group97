import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignInForm from './pages/SignInForm/SignInForm';
import SignUpForm from './pages/SignUpForm/SignUpForm';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import './App.css'; // Ensure you have a global stylesheet if needed

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <header className="app-header">
          <nav className="navbar">
            <h1>Fitness Management</h1>
            <ul>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/signin" className="nav-link">Sign In</Link></li>
              <li><Link to="/signup" className="nav-link">Sign Up</Link></li>
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            </ul>
          </nav>
        </header>

        {/* Page Routing */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
