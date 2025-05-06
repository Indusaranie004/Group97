import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import SignInForm from "./pages/SignInForm/SignInForm";
import SignUpForm from "./pages/SignUpForm/SignUpForm";
import CoachSignInForm from "./pages/CoachSignInForm/CoachSignInForm";
import CoachSignUpForm from "./pages/CoachSignUpForm/CoachSignUpForm";
import Dashboard from "./pages/Dashboard/Dashboard";
import CoachDashboard from "./pages/CoachDashboard/CoachDashboard";
import Home from "./pages/Home/Home";
import "./App.css";

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("coachToken")
  );
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    !!localStorage.getItem("userToken")
  );
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  const checkAuth = () => {
    const coachAuth = !!localStorage.getItem("coachToken");
    const userAuth = !!localStorage.getItem("userToken");
    setIsAuthenticated(coachAuth);
    setIsUserAuthenticated(userAuth);
    setIsLoading(false);
    return coachAuth || userAuth;
  };

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Custom storage event handler for cross-tab sync
    const handleStorageChange = (e) => {
      if (e.key === "coachToken" || e.key === "userToken") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle successful login
  const handleCoachLogin = () => {
    localStorage.setItem("coachToken", "true");
    checkAuth();
  };

  const handleUserLogin = () => {
    localStorage.setItem("userToken", "true");
    checkAuth();
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("coachToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("coachName");
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
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              {!isAuthenticated && !isUserAuthenticated ? (
                <>
                  <li>
                    <Link to="/signin" className="nav-link">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="nav-link">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {isAuthenticated ? (
                    <li>
                      <Link to="/coach/dashboard" className="nav-link">
                        Coach Dashboard
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <Link to="/dashboard" className="nav-link">
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        {/* Page Routing */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* User routes */}
            <Route
              path="/signin"
              element={
                isUserAuthenticated || isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <SignInForm onLogin={handleUserLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isUserAuthenticated || isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <SignUpForm onSignup={handleUserLogin} />
                )
              }
            />
            {/* Coach routes - hidden from UI but accessible via direct URL */}
            <Route
              path="/coach/signin"
              element={
                isAuthenticated ? (
                  <Navigate to="/coach/dashboard" replace />
                ) : (
                  <CoachSignInForm onLogin={handleCoachLogin} />
                )
              }
            />
            <Route
              path="/coach/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/coach/dashboard" replace />
                ) : (
                  <CoachSignUpForm onSignup={handleCoachLogin} />
                )
              }
            />
            {/* Redirect any /coach/ route to coach signin */}
            <Route
              path="/coach/*"
              element={
                isAuthenticated ? (
                  <Navigate to="/coach/dashboard" replace />
                ) : (
                  <Navigate to="/coach/signin" replace />
                )
              }
            />
            {/* Dashboard routes */}
            <Route
              path="/dashboard"
              element={
                isUserAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
            <Route
              path="/coach/dashboard"
              element={
                isAuthenticated ? (
                  <CoachDashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/coach/signin" replace />
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);

reportWebVitals();
