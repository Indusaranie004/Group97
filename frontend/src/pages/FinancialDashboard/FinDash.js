import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Chart, registerables } from "chart.js";
import "./FinDash.css";

// Register all Chart.js components
Chart.register(...registerables);

const FinancialDashboard = () => {
  const incomeExpenseChartRef = useRef(null);
  const netWorthPieChartRef = useRef(null);
  const incomeExpenseChartInstance = useRef(null);
  const netWorthPieChartInstance = useRef(null);
  
  // Mock dashboard data - using sample data instead of API fetch
  const dashboardData = {
    summary: {
      totalAssets: 325000,
      totalLiabilities: 175000,
      netWorth: 150000
    },
    incomeExpense: [
      { month: 'Jan', income: 6500, expense: 4800 },
      { month: 'Feb', income: 6200, expense: 5100 },
      { month: 'Mar', income: 6800, expense: 4600 },
      { month: 'Apr', income: 7200, expense: 5200 },
      { month: 'May', income: 6900, expense: 4900 },
      { month: 'Jun', income: 7500, expense: 5300 },
    ]
  };
  
  // Remove background image when dashboard loads
  useEffect(() => {
    // Clear the background image and any overlay
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#f5f7fa';
    
    // In case you have a pseudo-element overlay
    const style = document.createElement('style');
    style.innerHTML = `
      body::before { display: none !important; }
      body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow-x: hidden; }
      #root { width: 100%; height: 100%; }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up when component unmounts
      document.body.style.backgroundImage = '';
      document.body.style.backgroundColor = '';
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  // Create charts with sample data
  useEffect(() => {
    // Clear any existing chart instances
    if (incomeExpenseChartInstance.current) {
      incomeExpenseChartInstance.current.destroy();
    }
    if (netWorthPieChartInstance.current) {
      netWorthPieChartInstance.current.destroy();
    }
    
    // Function to resize charts based on container size
    const handleResize = () => {
      if (incomeExpenseChartInstance.current) {
        incomeExpenseChartInstance.current.resize();
      }
      if (netWorthPieChartInstance.current) {
        netWorthPieChartInstance.current.resize();
      }
    };

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Prepare income vs expense chart data
    const incomeExpenseData = {
      labels: dashboardData.incomeExpense.map(item => item.month),
      datasets: [
        {
          label: 'Income',
          data: dashboardData.incomeExpense.map(item => item.income),
          backgroundColor: 'rgba(26, 188, 156, 0.2)',
          borderColor: 'rgba(26, 188, 156, 1)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: dashboardData.incomeExpense.map(item => item.expense),
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          borderColor: 'rgba(231, 76, 60, 1)',
          borderWidth: 1
        }
      ]
    };
    
    // Prepare net worth pie chart data
    const netWorthPieData = {
      labels: ['Assets', 'Liabilities'],
      datasets: [{
        data: [
          dashboardData.summary.totalAssets,
          dashboardData.summary.totalLiabilities
        ],
        backgroundColor: [
          'rgba(26, 188, 156, 0.8)',
          'rgba(231, 76, 60, 0.8)'
        ],
        borderColor: [
          'rgba(26, 188, 156, 1)',
          'rgba(231, 76, 60, 1)'
        ],
        borderWidth: 1
      }]
    };
    
    // Create income vs expense chart
    if (incomeExpenseChartRef.current) {
      const ctx = incomeExpenseChartRef.current.getContext('2d');
      incomeExpenseChartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: incomeExpenseData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Income vs Expenses',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y || 0;
                  return `${label}: $${value.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Create net worth pie chart
    if (netWorthPieChartRef.current) {
      const ctx = netWorthPieChartRef.current.getContext('2d');
      netWorthPieChartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: netWorthPieData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Asset vs Liability Distribution',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: $${value.toLocaleString()} (${percentage}%)`;
                }
              }
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
    
    // Handle initial resize
    handleResize();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (incomeExpenseChartInstance.current) {
        incomeExpenseChartInstance.current.destroy();
      }
      if (netWorthPieChartInstance.current) {
        netWorthPieChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="financial-dashboard">
      <header className="main-header">
        <div className="header-content">
          <h1>Financial Dashboard</h1>
          <p className="header-subtitle">Your financial overview at a glance</p>
        </div>
      </header>
      
      <div className="dashboard-container">
        <nav className="main-navigation">
          <Link to="/FinancialLedger" className="nav-item">
            <i className="nav-icon icon-ledger"></i>
            <span>Financial Ledger</span>
          </Link>
          <Link to="/BankTransactions" className="nav-item">
            <i className="nav-icon icon-bank"></i>
            <span>Bank Transactions</span>
          </Link>
          <Link to="/AssetList" className="nav-item">
            <i className="nav-icon icon-asset"></i>
            <span>Assets</span>
          </Link>
          <Link to="/Liabilities" className="nav-item">
            <i className="nav-icon icon-liability"></i>
            <span>Liabilities</span>
          </Link>
        </nav>
        
        <div className="dashboard-summary">
          <div className="summary-card">
            <h4 className="mb-4">Total Assets</h4>
            <p className="summary-value">${dashboardData.summary.totalAssets.toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h4 className="mb-4">Total Liabilities</h4>
            <p className="summary-value">${dashboardData.summary.totalLiabilities.toLocaleString()}</p>
          </div>
          <div className="summary-card highlight">
            <h4 className="mb-4">Net Worth</h4>
            <p className="summary-value">${dashboardData.summary.netWorth.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>Income vs. Expenses</h3>
            <div className="chart-wrapper">
              <canvas id="income-expense-canvas" ref={incomeExpenseChartRef}></canvas>
            </div>
          </div>
          
          <div className="chart-container">
            <h3>Net Worth Composition</h3>
            <div className="chart-wrapper">
              <canvas id="net-worth-pie-canvas" ref={netWorthPieChartRef}></canvas>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/AddAsset" className="action-button asset-button">
              <i className="action-icon icon-plus"></i>
              Add New Asset
            </Link>
            <Link to="/CashLog" className="action-button cashlog-button">
              <i className="action-icon icon-cash"></i>
              Record Cash Transaction
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;