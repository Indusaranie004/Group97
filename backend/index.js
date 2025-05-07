// server/server.js
const express = require('express');
const connectDB = require('./config/db');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const feedbackRoutes = require('./routes/feedback');


const app = express();
const PORT = 5002;

app.use(bodyParser.json());
app.use('/api', feedbackRoutes);

//connect to database
connectDB();

mongoose.connect('mongodb://localhost:27017/feedback')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
