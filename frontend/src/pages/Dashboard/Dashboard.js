import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API requests
import './Dashboard.css';

const Dashboard = () => {
  const [coaches, setCoaches] = useState([]);
  const [trainerInfo, setTrainerInfo] = useState({
    id: 1, // Added an ID for uniqueness
    name: 'Coach John Doe',
    email: 'coach.john@example.com',
    profilePicture: 'https://via.placeholder.com/150',
    role: 'Fitness Trainer',
    experience: '5 years',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(trainerInfo);
  
  const [gymStats, setGymStats] = useState({
    totalMembers: 150,
    activeMembers: 120,
    upcomingSessions: 5,
    totalClasses: 10,
  });

  const [upcomingClasses, setUpcomingClasses] = useState([
    { id: 1, time: '9:00 AM', className: 'Yoga for Beginners', location: 'Studio A' },
    { id: 2, time: '11:00 AM', className: 'HIIT Workout', location: 'Studio B' },
    { id: 3, time: '1:00 PM', className: 'Strength Training', location: 'Gym Floor' },
  ]);

  // Fetch coaches when the component loads
  useEffect(() => {
    async function fetchCoaches() {
      try {
        const response = await axios.get('/api/coaches');
        setCoaches(response.data);
      } catch (error) {
        console.error('Error fetching coaches:', error);
      }
    }
    fetchCoaches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    if (isEditing) setTrainerInfo(formData);
    setIsEditing(!isEditing);
  };

  // Improved delete function to prevent errors
  const deleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      setTrainerInfo(null);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome, {trainerInfo ? `Coach ${trainerInfo.name}` : 'Guest'}!</h2>
        <p>Manage gym activities, check stats, and view upcoming classes.</p>
      </header>

      <div className="dashboard-body">
        <div className="dashboard-left">
          {/* Gym Stats */}
          <div className="stats-card">
            <h3>Gym Stats</h3>
            <ul>
              <li>Total Members: {gymStats.totalMembers}</li>
              <li>Active Members: {gymStats.activeMembers}</li>
              <li>Total Classes: {gymStats.totalClasses}</li>
              <li>Upcoming Sessions: {gymStats.upcomingSessions}</li>
            </ul>
          </div>

          {/* Trainer Profile */}
          {trainerInfo ? (
            <div className="profile-card">
              <h3>Your Profile</h3>
              <div className="profile-info">
                <div className="profile-image-wrapper">
                  <img src={trainerInfo.profilePicture} alt="Profile" className="profile-image" />
                </div>
                <div className="profile-details">
                  {isEditing ? (
                    <>
                      {['name', 'email', 'profilePicture', 'role', 'experience'].map((field) => (
                        <div className="profile-item" key={field}>
                          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                          <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <p><strong>Name:</strong> {trainerInfo.name}</p>
                      <p><strong>Email:</strong> {trainerInfo.email}</p>
                      <p><strong>Role:</strong> {trainerInfo.role}</p>
                      <p><strong>Experience:</strong> {trainerInfo.experience}</p>
                    </>
                  )}
                </div>
              </div>
              <button className="edit-profile-button" onClick={toggleEdit}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button className="delete-profile-button" onClick={deleteProfile}>Delete Profile</button>
            </div>
          ) : (
            <p className="deleted-message">Profile Deleted</p>
          )}

          {/* Display All Coaches */}
          <div className="coaches-card">
            <h3>All Coaches</h3>
            <ul>
              {coaches.map((coach) => (
                <li key={coach.id}>
                  <strong>{coach.name}</strong><br />
                  <span><strong>Email:</strong> {coach.email}</span><br />
                  <span><strong>Role:</strong> {coach.role}</span><br />
                  <span><strong>Experience:</strong> {coach.experience}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-right">
          {/* Upcoming Classes */}
          <div className="classes-card">
            <h3>Upcoming Classes</h3>
            <ul>
              {upcomingClasses.map((classItem) => (
                <li key={classItem.id}>
                  <strong>{classItem.className}</strong> at {classItem.time} in {classItem.location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
