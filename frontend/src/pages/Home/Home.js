import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Event handlers for auth boxes
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleEmployeeLoginClick = () => {
    navigate('/employee-login');
  };

  // Add smooth scrolling for navigation links
  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const targetId = e.currentTarget.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    };

    // Add event listeners to nav links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Implement scroll spy for active nav highlighting
    const handleScrollSpy = () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-links li');
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.querySelector('a').getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScrollSpy);

    // Cleanup event listeners on component unmount
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
      window.removeEventListener('scroll', handleScrollSpy);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container nav-container">
          <div className="logo">
            <div>
              FitnessPro
              <span className="logo-tagline">Manage. Train. Succeed</span>
            </div>
          </div>
          <ul className="nav-links">
            <li className="active"><a href="#home">HOME</a></li>
            <li><a href="#coaches">OUR TRAINERS</a></li>
            <li><a href="#help">HELP</a></li>
            <li><a href="#about">ABOUT US</a></li>
            <li><a href="#feedback">FEEDBACK</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <h1>Who keeps the fitness rolling?</h1>
        <p>Your fitness journey starts here</p>
        
        <div className="auth-options">
          <div className="auth-box login" onClick={handleLoginClick}>
            <i className="fas fa-sign-in-alt"></i>
            <h3>Wanna Log In?</h3>
          </div>
          
          <div className="auth-box signup" onClick={handleSignupClick}>
            <i className="fas fa-user-plus"></i>
            <h3>Sign Up!</h3>
          </div>  
          
          <div className="auth-box employee" onClick={handleEmployeeLoginClick}>
            <i className="fas fa-users-cog"></i>
            <h3>Employee?</h3>
          </div>
        </div>
      </section>

      {/* What's in our toolbox Section */}
      <section className="toolbox" id="toolbox">
        <div className="container">
          <div className="toolbox-header">
            <h2>What's in our toolbox?</h2>
            <p>Explore our expertise</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>FitnessPro is dedicated to helping you achieve your fitness goals through expert guidance and cutting-edge fitness management.</p>
            </div>
            
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: info@fitnesspro.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} FitnessPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;