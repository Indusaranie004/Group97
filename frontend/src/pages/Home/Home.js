import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div>
   

      {/* Hero Section */}
      <header className="hero">
        <h2>Stay Fit, Stay Healthy</h2>
        <p>Manage your fitness with our advanced system</p>
        <button className="cta-btn">Get Started</button>
      </header>

      {/* Features Section */}
      <section className="features">
        <h3>Why Choose Us?</h3>
        <div className="feature-list">
          <div className="feature-item">
            <h4>Personalized Plans</h4>
            <p>Customized workout and diet plans tailored for you.</p>
          </div>
          <div className="feature-item">
            <h4>Expert Coaches</h4>
            <p>Learn from the best trainers in the industry.</p>
          </div>
          <div className="feature-item">
            <h4>Progress Tracking</h4>
            <p>Monitor your improvements and reach your goals.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h3>What Our Users Say</h3>
        <div className="testimonial-list">
          <div className="testimonial">
            <p>"This platform transformed my fitness journey!"</p>
            <h5>- Alex</h5>
          </div>
          <div className="testimonial">
            <p>"Best decision I ever made. Love the tracking features!"</p>
            <h5>- Sarah</h5>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Fitness Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
