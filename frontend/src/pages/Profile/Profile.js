import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    coaches: []
  });
  const [allCoaches, setAllCoaches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCoachDropdown, setShowCoachDropdown] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState('');
  const [showCoachDeleteConfirm, setShowCoachDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile and coaches
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        // Fetch user profile
        const profileRes = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserData(profileRes.data.data.user);
        setEditData({
          name: profileRes.data.data.user.name,
          email: profileRes.data.data.user.email,
          password: '',
          confirmPassword: ''
        });

        // Fetch all available coaches
        const coachesRes = await axios.get('http://localhost:3000/api/v1/coaches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAllCoaches(coachesRes.data.data.coaches);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      if (editData.password !== editData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      const token = localStorage.getItem('userToken');
      const updateData = {
        name: editData.name,
        email: editData.email
      };

      if (editData.password) {
        updateData.password = editData.password;
      }

      const response = await axios.patch(
        'http://localhost:3000/api/auth/update-profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserData(response.data.data.user);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete('http://localhost:3000/api/auth/delete-profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem('userToken');
      navigate('/');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile');
    }
  };

  // Handle adding a coach
  const handleAddCoach = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.post(
        'http://localhost:3000/api/auth/add-coach',
        { coachId: selectedCoach },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserData(response.data.data.user);
      setShowCoachDropdown(false);
      setSelectedCoach('');
    } catch (error) {
      console.error('Error adding coach:', error);
      alert(error.response?.data?.message || 'Failed to add coach');
    }
  };

  // Handle removing a coach
  const handleRemoveCoach = async (coachId) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.delete(
        `http://localhost:3000/api/auth/remove-coach/${coachId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserData(response.data.data.user);
      setShowCoachDeleteConfirm(null);
    } catch (error) {
      console.error('Error removing coach:', error);
      alert('Failed to remove coach');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      
      {!isEditing ? (
        <div className="profile-info">
          <div className="profile-field">
            <label>Name:</label>
            <span>{userData.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{userData.email}</span>
          </div>
          
          <div className="coaches-section">
            <h3>Your Coaches</h3>
            {userData.coaches.length > 0 ? (
              <ul className="coaches-list">
                {userData.coaches.map(coach => (
                  <li key={coach._id}>
                    <span>{coach.name}</span>
                    <button 
                      onClick={() => setShowCoachDeleteConfirm(coach._id)}
                      className="delete-coach-btn"
                    >
                      Delete
                    </button>
                    
                    {showCoachDeleteConfirm === coach._id && (
                      <div className="confirmation-dialog">
                        <p>Are you sure you want to remove this coach?</p>
                        <button onClick={() => handleRemoveCoach(coach._id)}>Confirm</button>
                        <button onClick={() => setShowCoachDeleteConfirm(null)}>Cancel</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No coaches added yet.</p>
            )}
            
            <div className="add-coach-container">
              <button 
                onClick={() => setShowCoachDropdown(!showCoachDropdown)}
                className="add-coach-btn"
              >
                <span>+</span> Add Coach
              </button>
              
              {showCoachDropdown && (
                <div className="coach-dropdown">
                  <select
                    value={selectedCoach}
                    onChange={(e) => setSelectedCoach(e.target.value)}
                  >
                    <option value="">Select a coach</option>
                    {allCoaches.map(coach => (
                      <option key={coach._id} value={coach._id}>
                        {coach.name} ({coach.specialization})
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAddCoach}
                    disabled={!selectedCoach}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="profile-actions">
            <button onClick={() => setIsEditing(true)}>Update Profile</button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-profile-btn"
            >
              Delete Profile
            </button>
          </div>
          
          {showDeleteConfirm && (
            <div className="confirmation-dialog">
              <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
              <button onClick={handleDeleteProfile}>Confirm Delete</button>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          )}
        </div>
      ) : (
        <div className="edit-profile-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={editData.password}
              onChange={(e) => setEditData({...editData, password: e.target.value})}
              placeholder="Leave blank to keep current password"
            />
          </div>
          
          {editData.password && (
            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                value={editData.confirmPassword}
                onChange={(e) => setEditData({...editData, confirmPassword: e.target.value})}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button onClick={handleUpdateProfile}>Save Changes</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;