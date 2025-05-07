// models/TrainingRequest.js
const mongoose = require('mongoose');

const trainingRequestSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  coachId: {
    type: String,
    required: [true, 'Coach ID is required'],
    enum: Array.from({length: 15}, (_, i) => `CN${(i+1).toString().padStart(2, '0')}`),
    trim: true
  },
  trainingTopic: {
    type: String,
    required: [true, 'Training topic is required'],
    enum: [
      'Personal Training',
      'Weight Management',
      'Strength Training',
      'Cardio Programs',
      'Group Fitness',
      'Recovery Techniques'
    ]
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Training date must be in the future'
    }
  },
  durationHours: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Minimum duration is 1 hour'],
    max: [8, 'Maximum duration is 8 hours']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
trainingRequestSchema.index({ coachId: 1, dateTime: 1 });

// Pre-save hook to validate coach availability could be added here

const TrainingRequest = mongoose.model('TrainingRequest', trainingRequestSchema);

module.exports = TrainingRequest;
