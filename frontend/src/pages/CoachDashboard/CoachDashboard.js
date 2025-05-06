import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CoachDashboard.css';
import coachDefaultImage from '../../images/coach.png';
import { jsPDF } from 'jspdf';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  
  const [gymStats] = useState({
    totalMembers: 150,
    activeMembers: 120,
    upcomingSessions: 5,
    totalClasses: 10,
  });

  const [upcomingClasses] = useState([
    { id: 1, time: '9:00 AM', className: 'Yoga for Beginners', location: 'Studio A' },
    { id: 2, time: '11:00 AM', className: 'HIIT Workout', location: 'Studio B' },
    { id: 3, time: '1:00 PM', className: 'Strength Training', location: 'Gym Floor' },
  ]);

  // Check authentication and fetch data when component loads
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('coachToken');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        // Fetch all coaches
        const coachesResponse = await axios.get('http://localhost:5000/api/coach', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCoaches(coachesResponse.data);
        setFilteredCoaches(coachesResponse.data);
        
        // Fetch current coach profile
        const profileResponse = await axios.get('http://localhost:5000/api/coach/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTrainerInfo(profileResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('coachToken');
          navigate('/signin');
        }
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);

  // Filter coaches based on search term and experience
  useEffect(() => {
    let result = coaches;
    if (searchTerm) {
      result = result.filter(coach => 
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (experienceFilter) {
      result = result.filter(coach => 
        coach.experience && coach.experience.toString().includes(experienceFilter)
      );
    }
    setFilteredCoaches(result);
  }, [searchTerm, experienceFilter, coaches]);

  const handleCoachChange = (e) => {
    setEditingCoach({ ...editingCoach, [e.target.name]: e.target.value });
  };

  const startEditCoach = (coach) => {
    setEditingCoach({ 
      _id: coach._id,
      name: coach.name,
      email: coach.email,
      experience: coach.experience || '',
      profilePicture: coach.profilePicture || coachDefaultImage
    });
  };

  const cancelEditCoach = () => {
    setEditingCoach(null);
  };

  const saveCoach = async () => {
    const token = localStorage.getItem('coachToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      // Prepare the update data with only the allowed fields
      const updateData = {
        _id: editingCoach._id,
        name: editingCoach.name,
        email: editingCoach.email,
        experience: editingCoach.experience || undefined
      };

      await axios.put(`http://localhost:5000/api/coach/${editingCoach._id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh the coaches list
      const response = await axios.get('http://localhost:5000/api/coach', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCoaches(response.data);
      setFilteredCoaches(response.data);
      
      setEditingCoach(null);
    } catch (error) {
      console.error('Error updating coach:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('coachToken');
        navigate('/signin');
      } else {
        alert('Failed to update coach. Please try again.');
      }
    }
  };

  const deleteCoach = async (id) => {
    const token = localStorage.getItem('coachToken');
    if (!token) {
      navigate('/signin');
      return;
    }

    if (window.confirm('Are you sure you want to delete this coach?')) {
      try {
        await axios.delete(`http://localhost:5000/api/coach/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCoaches(coaches.filter(coach => coach._id !== id));
        setFilteredCoaches(filteredCoaches.filter(coach => coach._id !== id));
      } catch (error) {
        console.error('Error deleting coach:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('coachToken');
          navigate('/signin');
        } else {
          alert('Failed to delete coach. Please try again.');
        }
      }
    }
  };

  const downloadCoachDetails = () => {
    const doc = new jsPDF();
    
    
    // Add title
    doc.setFontSize(18);
    doc.text('Coach Details', 105, 15, { align: 'center' });
    
    // Add current date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    // Add table headers
    doc.setFontSize(12);
    doc.text('Name', 20, 35);
    doc.text('Email', 80, 35);
    doc.text('Experience (years)', 150, 35);
    
    // Add coach data
    let y = 45;
    filteredCoaches.forEach((coach, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.text('Name', 20, y);
        doc.text('Email', 80, y);
        doc.text('Experience (years)', 150, y);
        y += 10;
      }
      
      doc.setFontSize(10);
      doc.text(coach.name || '-', 20, y);
      doc.text(coach.email || '-', 80, y);
      doc.text(coach.experience ? coach.experience.toString() : '-', 150, y);
      y += 10;
      
      if (index < filteredCoaches.length - 1) {
        doc.line(20, y, 190, y);
        y += 5;
      }
    });
    
    doc.save('coach_details.pdf');
  };

  const handleLogout = () => {
    localStorage.removeItem('coachToken');
    localStorage.removeItem('coachName');
    if (props.onLogout) props.onLogout();
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      {/* Full-width header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h2>Welcome, {localStorage.getItem('coachName') ? `Coach ${localStorage.getItem('coachName')}` : 'Guest'}!</h2>
          <p>Manage gym activities, check stats, and view upcoming classes.</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Cards Row */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Members</h3>
            <p>{gymStats.totalMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Members</h3>
            <p>{gymStats.activeMembers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Classes</h3>
            <p>{gymStats.totalClasses}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Sessions</h3>
            <p>{gymStats.upcomingSessions}</p>
          </div>
        </div>

        <div className="main-dashboard-content">
          {/* Left Side - All Coaches */}
          <div className="coaches-section">
            <div className="coaches-header">
              <h3>All Coaches</h3>
              <div className="search-filter-container">
                <input
                  type="text"
                  placeholder="Search coaches..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Filter by experience (years)"
                  className="filter-input"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                  min="0"
                />
                <button 
                  className="download-btn"
                  onClick={downloadCoachDetails}
                >
                  Download Coach Details
                </button>
              </div>
            </div>
            <div className="coaches-grid">
              {filteredCoaches.map((coach) => (
                <div key={coach._id} className="coach-card">
                  <div className="coach-image-wrapper">
                    <img 
                      src={coach.profilePicture || coachDefaultImage} 
                      alt={coach.name} 
                      className="coach-image" 
                    />
                  </div>
                  <div className="coach-details">
                    <h4>{coach.name}</h4>
                    <p><strong>Email:</strong> {coach.email}</p>
                    {coach.experience && <p><strong>Experience:</strong> {coach.experience} years</p>}
                  </div>
                  <div className="coach-card-actions">
                    <button onClick={() => startEditCoach(coach)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteCoach(coach._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Upcoming Classes */}
          <div className="right-panel">
            <div className="upcoming-classes">
              <div className="classes-card">
                <h3>Upcoming Classes</h3>
                <ul>
                  {upcomingClasses.map((classItem) => (
                    <li key={classItem.id}>
                      <strong>{classItem.className}</strong>
                      <div className="class-details">
                        <span>{classItem.time}</span>
                        <span>{classItem.location}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Coach Modal */}
      {editingCoach && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Coach</h3>
            <div className="edit-coach-form">
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  name="name" 
                  value={editingCoach.name} 
                  onChange={handleCoachChange} 
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={editingCoach.email} 
                  onChange={handleCoachChange} 
                />
              </div>
              <div className="form-group">
                <label>Experience (years):</label>
                <input 
                  type="number" 
                  name="experience" 
                  value={editingCoach.experience || ''} 
                  onChange={handleCoachChange} 
                  min="0"
                />
              </div>
              <div className="modal-actions">
                <button onClick={saveCoach} className="save-btn">Save</button>
                <button onClick={cancelEditCoach} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;