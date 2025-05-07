// HomeScript.js - Utility functions for the FitnessPro Home page

// Handle login box click
export const handleLoginClick = () => {
    // You can add navigation or modal display logic here
    console.log('Login box clicked');
    // Example: redirect to login page
    window.location.href = '/login';
  };
  
  // Handle signup box click
  export const handleSignupClick = () => {
    console.log('Signup box clicked');
    // Example: redirect to signup page
    window.location.href = '/register';
  };
  
  // Handle employee login box click
  export const handleEmployeeLoginClick = () => {
    console.log('Employee login box clicked');
    // Example: redirect to employee login page
    window.location.href = '/employee-login';
  };
  
  // Add smooth scrolling to navigation links
  export const initSmoothScrolling = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for navbar height
            behavior: 'smooth'
          });
        }
      });
    });
  };
  
  // Add active class to nav links based on scroll position
  export const initScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.parentElement.classList.add('active');
        }
      });
    });
  };
  
  // Initialize all event handlers
  export const initHomePageEvents = () => {
    // Attach click handlers to auth boxes
    const loginBox = document.getElementById('login-box');
    const signupBox = document.getElementById('signup-box');
    const employeeBox = document.getElementById('employee-box');
    
    if (loginBox) loginBox.addEventListener('click', handleLoginClick);
    if (signupBox) signupBox.addEventListener('click', handleSignupClick);
    if (employeeBox) employeeBox.addEventListener('click', handleEmployeeLoginClick);
    
    // Initialize smooth scrolling and scroll spy
    initSmoothScrolling();
    initScrollSpy();
  };
  
  // Export default object with all functions
  export default {
    handleLoginClick,
    handleSignupClick,
    handleEmployeeLoginClick,
    initSmoothScrolling,
    initScrollSpy,
    initHomePageEvents
  };