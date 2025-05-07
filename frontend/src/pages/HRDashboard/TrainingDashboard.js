import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './TrainingDashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { 
  Chart, 
  PieController, 
  ArcElement, 
  BarController, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend,
  LineController,
  LineElement,
  PointElement,
  RadialLinearScale,
  PolarAreaController,
  DoughnutController
} from 'chart.js';

// Register all Chart.js components
Chart.register(
  PieController, 
  ArcElement, 
  BarController, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Tooltip, 
  Legend,
  LineController,
  LineElement,
  PointElement,
  RadialLinearScale,
  PolarAreaController,
  DoughnutController
);

const TrainingDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Filters
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCoachId, setSelectedCoachId] = useState('');
  
  // Report States
  const [reportType, setReportType] = useState('total');

  // Chart refs
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);
  const statusTrendChartRef = useRef(null);
  const polarChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/training-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const destroyCharts = useCallback(() => {
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
      pieChartRef.current = null;
    }
    if (barChartRef.current) {
      barChartRef.current.destroy();
      barChartRef.current = null;
    }
    if (statusTrendChartRef.current) {
      statusTrendChartRef.current.destroy();
      statusTrendChartRef.current = null;
    }
    if (polarChartRef.current) {
      polarChartRef.current.destroy();
      polarChartRef.current = null;
    }
    if (doughnutChartRef.current) {
      doughnutChartRef.current.destroy();
      doughnutChartRef.current = null;
    }
  }, []);

  const renderCharts = useCallback(() => {
    destroyCharts();

    if (!requests.length) return;

    // Get chart canvas elements
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    const statusTrendCtx = document.getElementById('statusTrendChart')?.getContext('2d');
    const polarCtx = document.getElementById('polarChart')?.getContext('2d');
    const doughnutCtx = document.getElementById('doughnutChart')?.getContext('2d');

    if (!pieCtx || !barCtx || !statusTrendCtx || !polarCtx || !doughnutCtx) return;

    // 1. Pie Chart - Request Status Distribution
    const statusCounts = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});

    pieChartRef.current = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(statusCounts).map(status => 
          status.charAt(0).toUpperCase() + status.slice(1)
        ),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(26, 188, 156, 0.7)',
            'rgba(231, 76, 60, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(241, 196, 15, 0.7)',
          ],
          borderColor: [
            'rgba(26, 188, 156, 1)',
            'rgba(231, 76, 60, 1)',
            'rgba(52, 152, 219, 1)',
            'rgba(241, 196, 15, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Training Requests by Status',
            font: { size: 14 }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });

    // 2. Bar Chart - Requests by Coach
    const coachCounts = requests.reduce((acc, req) => {
      const coachId = req.coachId || 'Unassigned';
      acc[coachId] = (acc[coachId] || 0) + 1;
      return acc;
    }, {});

    const sortedCoaches = Object.entries(coachCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    barChartRef.current = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: sortedCoaches.map(([coachId]) => coachId),
        datasets: [{
          label: 'Number of Requests',
          data: sortedCoaches.map(([_, count]) => count),
          backgroundColor: 'rgba(26, 188, 156, 0.7)',
          borderColor: 'rgba(26, 188, 156, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Top Coaches by Training Requests',
            font: { size: 14 }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Requests',
              font: { size: 10 }
            }
          }
        }
      }
    });

    // 3. Line Chart - Status Trend Over Time
    const allDates = [...new Set(requests.map(req => 
      new Date(req.dateTime).toISOString().split('T')[0]
    ))].sort();

    const dateStatusCounts = {};
    allDates.forEach(date => {
      dateStatusCounts[date] = {
        approved: 0,
        rejected: 0,
        pending: 0,
        completed: 0
      };
    });

    requests.forEach(req => {
      const date = new Date(req.dateTime).toISOString().split('T')[0];
      if (dateStatusCounts[date]) {
        dateStatusCounts[date][req.status] = (dateStatusCounts[date][req.status] || 0) + 1;
      }
    });

    statusTrendChartRef.current = new Chart(statusTrendCtx, {
      type: 'line',
      data: {
        labels: allDates.map(date => 
          new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
          {
            label: 'Approved',
            data: allDates.map(date => dateStatusCounts[date].approved),
            borderColor: 'rgba(26, 188, 156, 1)',
            backgroundColor: 'rgba(26, 188, 156, 0.1)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Rejected',
            data: allDates.map(date => dateStatusCounts[date].rejected),
            borderColor: 'rgba(231, 76, 60, 1)',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Pending',
            data: allDates.map(date => dateStatusCounts[date].pending),
            borderColor: 'rgba(241, 196, 15, 1)',
            backgroundColor: 'rgba(241, 196, 15, 0.1)',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Completed',
            data: allDates.map(date => dateStatusCounts[date].completed),
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Training Request Status Trends',
            font: { size: 14 }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Requests',
              font: { size: 10 }
            }
          }
        }
      }
    });

    // 4. Polar Area Chart - Training Topics Distribution
    const topicCounts = requests.reduce((acc, req) => {
      acc[req.trainingTopic] = (acc[req.trainingTopic] || 0) + 1;
      return acc;
    }, {});

    polarChartRef.current = new Chart(polarCtx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(topicCounts),
        datasets: [{
          data: Object.values(topicCounts),
          backgroundColor: [
            'rgba(26, 188, 156, 0.7)',
            'rgba(52, 152, 219, 0.7)',
            'rgba(155, 89, 182, 0.7)',
            'rgba(241, 196, 15, 0.7)',
            'rgba(231, 76, 60, 0.7)',
          ],
          borderColor: [
            'rgba(26, 188, 156, 1)',
            'rgba(52, 152, 219, 1)',
            'rgba(155, 89, 182, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(231, 76, 60, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Training Topics Distribution',
            font: { size: 14 }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });

    // 5. Doughnut Chart - Urgency Level Distribution
    const urgencyCounts = requests.reduce((acc, req) => {
      acc[req.urgency] = (acc[req.urgency] || 0) + 1;
      return acc;
    }, {});

    doughnutChartRef.current = new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(urgencyCounts).map(urgency => 
          urgency.charAt(0).toUpperCase() + urgency.slice(1)
        ),
        datasets: [{
          data: Object.values(urgencyCounts),
          backgroundColor: [
            'rgba(231, 76, 60, 0.7)',
            'rgba(241, 196, 15, 0.7)',
            'rgba(46, 204, 113, 0.7)',
          ],
          borderColor: [
            'rgba(231, 76, 60, 1)',
            'rgba(241, 196, 15, 1)',
            'rgba(46, 204, 113, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Training Request Urgency Levels',
            font: { size: 14 }
          },
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 10 }
            }
          }
        }
      }
    });
  }, [destroyCharts, requests]);

  useEffect(() => {
    if (!loading && requests.length > 0 && activeTab === 'charts') {
      renderCharts();
    }

    return () => {
      destroyCharts();
    };
  }, [loading, requests, activeTab, renderCharts, destroyCharts]);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/training-requests/${id}`, { status });
      setRequests(prev =>
        prev.map(req => (req._id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesDate = selectedDate
      ? new Date(req.dateTime).toISOString().slice(0, 10) === selectedDate
      : true;
    const matchesCoach = selectedCoachId ? req.coachId === selectedCoachId : true;
    return matchesDate && matchesCoach;
  });

  // Report generation functions
  const generateTotalSummaryReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const title = 'Total Training Requests Summary';
    
    const columns = [
      { header: 'Status', dataKey: 'status' },
      { header: 'Count', dataKey: 'count' },
      { header: 'Percentage', dataKey: 'percentage' }
    ];
    
    const statusCounts = requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {});
    
    const reportData = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: `${((count / requests.length) * 100).toFixed(1)}%`
    }));
    
    reportData.push({
      status: 'Total',
      count: requests.length,
      percentage: '100%'
    });
    
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 30);

    autoTable(doc, {
      startY: 35,
      head: [columns.map(col => col.header)],
      body: reportData.map(item => columns.map(col => item[col.dataKey])),
      margin: { top: 35 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save(`total_summary_report_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  const generateAllCoachesReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const title = 'All Schedules by Coach ID';
    
    const columns = [
      { header: 'Member', dataKey: 'memberName' },
      { header: 'Training Topic', dataKey: 'trainingTopic' },
      { header: 'Date & Time', dataKey: 'dateTime' },
      { header: 'Duration', dataKey: 'durationHours' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 30);

    let yPosition = 35;
    const coachIds = [...new Set(requests.map(req => req.coachId))].filter(id => id);
    
    coachIds.forEach((coachId, index) => {
      const coachData = requests
        .filter(req => req.coachId === coachId)
        .map(req => ({
          ...req,
          dateTime: new Date(req.dateTime).toLocaleString(),
          durationHours: `${req.durationHours} hours`,
          status: req.status.charAt(0).toUpperCase() + req.status.slice(1)
        }));
      
      if (coachData.length === 0) return;
      
      if (index > 0 && yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.text(`Coach ID: ${coachId}`, 14, yPosition);
      yPosition += 8;
      
      autoTable(doc, {
        startY: yPosition,
        head: [columns.map(col => col.header)],
        body: coachData.map(item => columns.map(col => item[col.dataKey])),
        margin: { top: yPosition },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(10);
      doc.text(`Total schedules for ${coachId}: ${coachData.length}`, 14, yPosition);
      yPosition += 10;
    });
    
    doc.save(`all_coaches_schedules_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  const generateAllDatesReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const title = 'All Schedules by Date';
    
    const columns = [
      { header: 'Member', dataKey: 'memberName' },
      { header: 'Coach ID', dataKey: 'coachId' },
      { header: 'Training Topic', dataKey: 'trainingTopic' },
      { header: 'Time', dataKey: 'time' },
      { header: 'Duration', dataKey: 'durationHours' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 30);

    let yPosition = 35;
    const allDates = [...new Set(requests.map(req => new Date(req.dateTime).toISOString().slice(0, 10)))].sort();
    
    allDates.forEach((date, index) => {
      const dateData = requests
        .filter(req => new Date(req.dateTime).toISOString().slice(0, 10) === date)
        .map(req => {
          const dateObj = new Date(req.dateTime);
          return {
            ...req,
            time: dateObj.toLocaleTimeString(),
            durationHours: `${req.durationHours} hours`,
            status: req.status.charAt(0).toUpperCase() + req.status.slice(1)
          };
        });
      
      if (dateData.length === 0) return;
      
      if (index > 0 && yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      const formattedDate = new Date(date).toLocaleDateString();
      
      doc.setFontSize(12);
      doc.text(`Date: ${formattedDate}`, 14, yPosition);
      yPosition += 8;
      
      autoTable(doc, {
        startY: yPosition,
        head: [columns.map(col => col.header)],
        body: dateData.map(item => columns.map(col => item[col.dataKey])),
        margin: { top: yPosition },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      yPosition = doc.lastAutoTable.finalY + 15;
      
      doc.setFontSize(10);
      doc.text(`Total schedules for ${formattedDate}: ${dateData.length}`, 14, yPosition);
      yPosition += 10;
    });
    
    doc.save(`all_dates_schedules_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  const generateContactsReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const title = 'Contact Information List';
    
    const columns = [
      { header: 'Member Name', dataKey: 'memberName' },
      { header: 'Contact Number', dataKey: 'contactNumber' },
      { header: 'Assigned Coach', dataKey: 'coachId' },
      { header: 'Last Training', dataKey: 'lastTraining' },
      { header: 'Status', dataKey: 'status' }
    ];
    
    const memberMap = {};
    requests.forEach(req => {
      const existingEntry = memberMap[req.memberName];
      if (!existingEntry || new Date(req.dateTime) > new Date(existingEntry.dateTime)) {
        memberMap[req.memberName] = req;
      }
    });
    
    const reportData = Object.values(memberMap).map(req => ({
      memberName: req.memberName,
      contactNumber: req.contactNumber,
      coachId: req.coachId,
      lastTraining: new Date(req.dateTime).toLocaleDateString(),
      status: req.status.charAt(0).toUpperCase() + req.status.slice(1)
    }));
    
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 30);

    autoTable(doc, {
      startY: 35,
      head: [columns.map(col => col.header)],
      body: reportData.map(item => columns.map(col => item[col.dataKey])),
      margin: { top: 35 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 35;
    doc.text(`Total contacts: ${reportData.length}`, 14, finalY + 10);

    doc.save(`contacts_list_${currentDate.replace(/\//g, '-')}.pdf`);
  };

  const generateReport = () => {
    switch (reportType) {
      case 'total':
        generateTotalSummaryReport();
        break;
      case 'allCoaches':
        generateAllCoachesReport();
        break;
      case 'allDates':
        generateAllDatesReport();
        break;
      case 'contacts':
        generateContactsReport();
        break;
      default:
        break;
    }
  };

  const handleBackToHR = () => {
    navigate('/hr-profile');
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Training Dashboard</h3>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </li>
          <li 
            className={activeTab === 'search' ? 'active' : ''}
            onClick={() => setActiveTab('search')}
          >
            <i className="fas fa-search"></i> Search & Filter
          </li>
          <li 
            className={activeTab === 'charts' ? 'active' : ''}
            onClick={() => setActiveTab('charts')}
          >
            <i className="fas fa-chart-bar"></i> Analytics
          </li>
          <li 
            className={activeTab === 'reports' ? 'active' : ''}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-file-pdf"></i> Reports
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container-fluid mt-3">
          {/* Dashboard Header with Back Button */}
          <div className="dashboard-header">
            <h2 className="dashboard-title">Training Requests Dashboard</h2>
            <button 
              className="back-button"
              onClick={handleBackToHR}
            >
              <i className="fas fa-arrow-left"></i> Back to HR Profile
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Contact</th>
                      <th>Coach</th>
                      <th>Training Topic</th>
                      <th>Date & Time</th>
                      <th>Duration</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(request => (
                      <tr key={request._id}>
                        <td>{request.memberName}</td>
                        <td>{request.contactNumber}</td>
                        <td>{request.coachId}</td>
                        <td>{request.trainingTopic}</td>
                        <td>
                          {request.dateTime
                            ? new Date(request.dateTime).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td>{request.durationHours} hours</td>
                        <td>
                          <span
                            className={`badge ${
                              request.urgency === 'high'
                                ? 'bg-danger'
                                : request.urgency === 'medium'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                          >
                            {request.urgency}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              request.status === 'approved'
                                ? 'bg-success'
                                : request.status === 'rejected'
                                ? 'bg-danger'
                                : request.status === 'completed'
                                ? 'bg-info'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(request._id, 'approved')}
                              disabled={request.status === 'approved'}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusChange(request._id, 'rejected')}
                              disabled={request.status === 'rejected'}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleStatusChange(request._id, 'completed')}
                              disabled={request.status === 'completed'}
                            >
                              Complete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Search & Filter Tab */}
          {activeTab === 'search' && (
            <>
              <h2 className="mb-4">Search & Filter Training Requests</h2>
              
              <div className="d-flex gap-2 mb-4">
                <div>
                  <label htmlFor="filter-date" className="form-label small">Filter by Date:</label>
                  <input
                    type="date"
                    id="filter-date"
                    className="form-control form-control-sm"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="filter-coach" className="form-label small">Filter by Coach ID:</label>
                  <select
                    id="filter-coach"
                    className="form-select form-select-sm"
                    value={selectedCoachId}
                    onChange={e => setSelectedCoachId(e.target.value)}
                  >
                    <option value="">All Coaches</option>
                    {Array.from({ length: 15 }, (_, i) => {
                      const id = `CN${(i + 1).toString().padStart(2, '0')}`;
                      return (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Contact</th>
                      <th>Coach</th>
                      <th>Training Topic</th>
                      <th>Date & Time</th>
                      <th>Duration</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(request => (
                      <tr key={request._id}>
                        <td>{request.memberName}</td>
                        <td>{request.contactNumber}</td>
                        <td>{request.coachId}</td>
                        <td>{request.trainingTopic}</td>
                        <td>
                          {request.dateTime
                            ? new Date(request.dateTime).toLocaleString()
                            : 'N/A'}
                        </td>
                        <td>{request.durationHours} hours</td>
                        <td>
                          <span
                            className={`badge ${
                              request.urgency === 'high'
                                ? 'bg-danger'
                                : request.urgency === 'medium'
                                ? 'bg-warning text-dark'
                                : 'bg-secondary'
                            }`}
                          >
                            {request.urgency}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              request.status === 'approved'
                                ? 'bg-success'
                                : request.status === 'rejected'
                                ? 'bg-danger'
                                : request.status === 'completed'
                                ? 'bg-info'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(request._id, 'approved')}
                              disabled={request.status === 'approved'}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleStatusChange(request._id, 'rejected')}
                              disabled={request.status === 'rejected'}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleStatusChange(request._id, 'completed')}
                              disabled={request.status === 'completed'}
                            >
                              Complete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No matching requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && (
            <>
              <h2 className="mb-4">Training Analytics</h2>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card" style={{ height: '300px' }}>
                    <div className="card-body p-2">
                      <canvas id="pieChart" height="220"></canvas>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card" style={{ height: '300px' }}>
                    <div className="card-body p-2">
                      <canvas id="barChart" height="220"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card" style={{ height: '300px' }}>
                    <div className="card-body p-2">
                      <canvas id="statusTrendChart" height="220"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card" style={{ height: '300px' }}>
                    <div className="card-body p-2">
                      <canvas id="polarChart" height="220"></canvas>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card" style={{ height: '300px' }}>
                    <div className="card-body p-2">
                      <canvas id="doughnutChart" height="220"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <>
              <h2 className="mb-4">Generate Reports</h2>
              
              <div className="card">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="reportType" className="form-label">
                      Select Report Type
                    </label>
                    <select
                      id="reportType"
                      className="form-select"
                      value={reportType}
                      onChange={e => setReportType(e.target.value)}
                    >
                      <option value="total">Total Requests Summary</option>
                      <option value="allCoaches">All Schedules by Coach ID</option>
                      <option value="allDates">All Schedules by Date</option>
                      <option value="contacts">Contact Information List</option>
                    </select>
                  </div>
                  
                  <button
                    className="btn btn-primary"
                    onClick={generateReport}
                  >
                    <i className="fas fa-download me-2"></i> Generate PDF Report
                  </button>
                  
                  <div className="mt-4">
                    <h5>Report Descriptions:</h5>
                    <ul className="list-group">
                      <li className="list-group-item">
                        <strong>Total Requests Summary:</strong> Shows counts and percentages of requests by status
                      </li>
                      <li className="list-group-item">
                        <strong>All Schedules by Coach ID:</strong> Lists all training sessions grouped by coach
                      </li>
                      <li className="list-group-item">
                        <strong>All Schedules by Date:</strong> Lists all training sessions grouped by date
                      </li>
                      <li className="list-group-item">
                        <strong>Contact Information List:</strong> Provides member contact details with their latest training status
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;  //this is my training dashboard code. 

//give me a .css code for this dashboard using dark green and  light green colors.this dashboard is related to fitness management system. give me the css code without affecting to other css codes or pages.