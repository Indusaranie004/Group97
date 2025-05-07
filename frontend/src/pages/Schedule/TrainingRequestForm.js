// components/TrainingRequestForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TrainingRequestForm.css';

const TrainingRequestForm = () => {
  const [formData, setFormData] = useState({
    memberName: '',
    contactNumber: '',
    coachId: 'CN01',
    trainingTopic: 'Personal Training',
    dateTime: '',
    durationHours: 1,
    urgency: 'medium',
    status: 'pending'
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const coachOptions = Array.from({ length: 15 }, (_, i) => `CN${(i + 1).toString().padStart(2, '0')}`);
  const trainingTopics = [
    'Personal Training',
    'Weight Management',
    'Strength Training',
    'Cardio Programs',
    'Group Fitness',
    'Recovery Techniques'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/training-requests', {
        ...formData,
        dateTime: new Date(formData.dateTime)
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success">
        Your training request has been submitted successfully!
      </div>
    );
  }

  return (
    <div className="training-form-page">
      <div className="training-form-box">
        <h2>Gym Training Schedule Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Member Name</label>
            <input
              type="text"
              className="form-control"
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Coach ID</label>
            <select
              className="form-select"
              name="coachId"
              value={formData.coachId}
              onChange={handleChange}
              required
            >
              {coachOptions.map(coachId => (
                <option key={coachId} value={coachId}>{coachId}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Training Topic</label>
            <select
              className="form-select"
              name="trainingTopic"
              value={formData.trainingTopic}
              onChange={handleChange}
              required
            >
              {trainingTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Date and Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Duration (hours)</label>
            <input
              type="number"
              className="form-control"
              name="durationHours"
              min="1"
              max="8"
              value={formData.durationHours}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Urgency</label>
            <select
              className="form-select"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <input
            type="hidden"
            name="status"
            value={formData.status}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrainingRequestForm;

