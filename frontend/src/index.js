import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router

import CashEntryForm from './pages/FinancialLedger/CashLog';
import CashLogEntries from './pages/FinancialLedger/FinLedger';

import FMLogIn from './pages/FMLogIn/FMLogIn';
import FinancialManagerSignup from './pages/FMSignUp/FMSignUp';
import FMProfile from './pages/FMProfile/FMProfile';

import AddGymAsset from './pages/Assets/Assets';
import AssetList from './pages/Assets/AssetList';
import EditAsset from './pages/Assets/EditAsset'; 
import Liabilities from './pages/Liabilities/Liability';

import PaymentForm from './pages/payment/PaymentForm';
import BankTransactions from './pages/BankTransactions/BankTransactions';
import FinancialDashboard from './pages/FinancialDashboard/FinDash';

import './pages/FinancialLedger/FinLedger.css'; 
import './pages/FinancialLedger/CashLog.css';
import './pages/FMLogIn/FMLogIn.css';
import './pages/FMSignUp/FMSignUp.css';
import './pages/Assets/Assets.css';
import './pages/FMProfile/FMProfile.css';
import './pages/Assets/AssetList.css';
import './pages/Assets/EditAsset.css';
import './pages/payment/Payment.css';
import './pages/BankTransactions/BankTransactions.css';
import './pages/FinancialDashboard/FinDash.css';
import './pages/Liabilities/Liability.css';


import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
    
        <Route path="/CashLog" element={<CashEntryForm />} />  
        <Route path="/FinancialLedger" element={<CashLogEntries />} />  
        <Route path="/FMLogin" element={<FMLogIn />} />  
        <Route path="/FMSignUp" element={<FinancialManagerSignup />} />  
        <Route path="/AddAsset" element={<AddGymAsset />} />  
        <Route path="/FMProfile" element={<FMProfile />} />  
        <Route path="/AssetList" element={<AssetList />} /> 
        <Route path="/edit-asset/:id" element={<EditAsset />} /> {/* Add EditAsset route */}
        <Route path="/Payment" element={<PaymentForm />} />  
        <Route path="/BankTransactions" element={<BankTransactions/>} /> 
        <Route path="/FinancialDashboard" element={<FinancialDashboard/>} /> 
        <Route path="/Liabilities" element={<Liabilities/>} /> 

      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();