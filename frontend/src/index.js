// You can also add event handlers by importing React hooks
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Import global styles if needed

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import Home component
import Home from "./pages/Home/Home";
import TrainingRequestForm from './pages/Schedule/TrainingRequestForm';
import HRManagerRegister from "./pages/HRManagerRegister/HRManagerRegister";
import HRManagerLogin from "./pages/HRManagerLogin/HRManagerLogin";
import PayrollDashboard from "./pages/PayrollDashboard/PayrollDashboard";
//import ForgotPassword from "./Components/ForgotPassword"; // Import ForgotPassword component
import HRManagerProfile from "./pages/HRManagerProfile/HRManagerProfile";
import HRDashboard from "./pages/HRDashboard/TrainingDashboard";

import "./App.css"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/training-request" element={<TrainingRequestForm />} />
        <Route path="/register" element={<HRManagerRegister />} />
        <Route path="/login" element={<HRManagerLogin />} />
        {/* Add Forgot Password route */}
        <Route path="/payroll-dashboard" element={<PayrollDashboard />} />
        <Route path="/hr-profile" element={<HRManagerProfile />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/" element={<Home />} /> {/* Changed default route to Home */}
      </Routes>
    </Router>
  </React.StrictMode>
);