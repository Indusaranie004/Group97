
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import global styles if needed

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HRManagerRegister from "./pages/HRManagerRegister/HRManagerRegister";
import HRManagerLogin from "./pages/HRManagerLogin/HRManagerLogin";
import PayrollDashboard from "./pages/PayrollDashboard/PayrollDashboard";
//import ForgotPassword from "./Components/ForgotPassword"; // Import ForgotPassword component
import HRManagerProfile from "./pages/HRManagerProfile/HRManagerProfile";
import HRDashboard from "./pages/HRDashboard/HRDashboard";

import "./App.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        
      <Route path="/" element={<HRManagerRegister />} /> 
        <Route path="/login" element={<HRManagerLogin />} />
        {/* Add Forgot Password route */}
        <Route path="/payroll-dashboard" element={<PayrollDashboard />} />
        <Route path="/hr-profile" element={<HRManagerProfile />} /> {/* HR Manager Dashboard route */}
        <Route path="/hr-dashboard" element={<HRDashboard />} /> 
      </Routes>
    </Router>

  </React.StrictMode>
);

