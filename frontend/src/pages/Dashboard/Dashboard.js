import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [selectedCoaches, setSelectedCoaches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch coaches when component loads
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const token = localStorage.getItem('userToken');
        console.log('Token in fetchCoaches:', token); // Debug log

        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/coach', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCoaches(response.data);
        setFilteredCoaches(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coaches:', error);
        setError('Failed to load coaches. Please try again later.');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, [navigate]);

  // Filter coaches based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoaches(coaches);
    } else {
      const filtered = coaches.filter(coach => 
        coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coach.experience && coach.experience.toString().includes(searchTerm))
      );
      setFilteredCoaches(filtered);
    }
  }, [searchTerm, coaches]);

  const handleChooseCoach = async (coachId) => {
    try {
      const token = localStorage.getItem('userToken');
      console.log('Token in handleChooseCoach:', token); // Debug log

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('http://localhost:5000/api/auth/add-coach', 
        { coachId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const selectedCoach = coaches.find(coach => coach._id === coachId);
      setSelectedCoaches([...selectedCoaches, selectedCoach]);
    } catch (error) {
      console.error('Error choosing coach:', error);
      alert(error.response?.data?.message || 'Failed to choose coach. Please try again.');
    }
  };

  const handleRemoveCoach = async (coachId) => {
    try {
      const token = localStorage.getItem('userToken');
      console.log('Token in handleRemoveCoach:', token); // Debug log

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.delete(`http://localhost:5000/api/auth/remove-coach/${coachId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedCoaches(selectedCoaches.filter(coach => coach._id !== coachId));
    } catch (error) {
      console.error('Error removing coach:', error);
      alert(error.response?.data?.message || 'Failed to remove coach. Please try again.');
    }
  };

  const isCoachSelected = (coachId) => {
    return selectedCoaches.some(coach => coach._id === coachId);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('UserName');
    localStorage.removeItem('userId');
    if (props.onLogout) props.onLogout();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading coaches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h2>Coach Directory</h2>
          <p>Find and connect with professional coaches</p>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search coaches by name, email, or experience..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Coaches List */}
        <div className="coaches-list">
          {filteredCoaches.length > 0 ? (
            filteredCoaches.map((coach) => (
              <div key={coach._id} className="coach-line-card">
                <div className="coach-info">
                  <div className="coach-icon">
                    {coach.profilePicture ? (
                      <img src={coach.profilePicture} alt={coach.name} />
                    ) : (
                      <span className="default-icon">👤</span>
                    )}
                  </div>
                  <span className="coach-name">{coach.name}</span>
                  <span className="coach-experience">{coach.experience || '0'} years experience</span>
                </div>
                {isCoachSelected(coach._id) ? (
                  <button
                    onClick={() => handleRemoveCoach(coach._id)}
                    className="action-btn remove-btn"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={() => handleChooseCoach(coach._id)}
                    className="action-btn choose-btn"
                  >
                    Choose
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              No coaches found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;