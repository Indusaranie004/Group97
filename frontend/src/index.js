import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router

import CashEntryForm from './pages/findashboard/CashLog';
import FinLedger from './pages/findashboard/FinLedger';

import FMLogIn from './pages/FMLogIn/FMLogIn';
import FinancialManagerSignup from './pages/FMSignUp/FMSignUp';
import FMProfile from './pages/FMProfile/FMProfile';
import FinLedgerHandler from './pages/findashboard/FinLed_Handler';

import AddGymAsset from './pages/Liabilities/Liabilities';
import Liabilities from './pages/Liabilities/AssetList';

import Dashboard from './pages/findashboard/findash'; // Import Dashboard

import './pages/findashboard/findash.css'; // Import Dashboard CSS
import './pages/findashboard/CashLog.css';
import './pages/findashboard/FinLedger.css';
import './pages/FMLogIn/FMLogIn.css';
import './pages/FMSignUp/FMSignUp.css';
import './pages/Liabilities/Liabilities.css';
import './pages/FMProfile/FMProfile.css';
import './pages/Liabilities/AssetList.css';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>

        <Route path="/FinancialDashboard" element={<Dashboard />} />  
        <Route path="/CashLog" element={<CashEntryForm />} />  
        <Route path="/FinancialLedger" element={<FinLedger />} />  
        <Route path="/FMLogin" element={<FMLogIn />} />  
        <Route path="/FMSignUp" element={<FinancialManagerSignup />} />  
        <Route path="/Liabilities" element={<AddGymAsset />} />  
        <Route path="/FMProfile" element={<FMProfile />} />  
        <Route path="/FinLedHandler" element={<FinLedgerHandler />} /> 
        <Route path="/AssetList" element={<Liabilities />} /> 

      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
