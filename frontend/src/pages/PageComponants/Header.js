import React from "react";
import { Link } from "react-router-dom";
import '../App.css'
const Navbar = () =>  {
return(
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
);
};

export default Navbar;