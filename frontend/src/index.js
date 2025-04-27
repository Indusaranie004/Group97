import React from 'react';
import { createRoot } from 'react-dom/client';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/context/AuthContext';
import Navbar from './pages/Home/Navbar';
import PrivateRoute from './pages/Profile/PrivateRoute';
import Home from './pages/Home/Home';
import Login from './pages/LoginPage/Login';
import Register from './pages/SignupPage/Register';
import Profile from './pages/Profile/Profile';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import './App.css';

// Get the root container
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render your app
root.render(
  <React.StrictMode>
    <Router>
         <AuthProvider>
           <div className="app">
             {/* <Navbar /> */}
             <div className="main-content">
               <Routes>
                 <Route path="/" element={<Home />} />
                 <Route path="/login" element={<Login />} />
                 <Route path="/register" element={<Register />} />
                 <Route path="/forgot-password" element={<ForgotPassword />} />
                 <Route path="/reset-password" element={<ResetPassword />} />
                 <Route
                   path="/profile"
                   element={
                     <PrivateRoute>
                       <Profile />
                     </PrivateRoute>
                   }
                 />
               </Routes>
             </div>
           </div>
         </AuthProvider>
       </Router>
  </React.StrictMode>
);