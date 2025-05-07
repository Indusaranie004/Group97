const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterController = require("./Controllers/RegisterControllers");
const TrainingRequest = require('./Model/TrainingRequest');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://Indusaranie:Group97Y2S2@fitnesspro.h0hzx.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// Routes
const router = require("./Routes/PayrollRoutes");
app.use("/payrolls", router);

// User registration
const User = mongoose.model("Register");
app.post("/registers", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ status: "ok", user });
  } catch (err) {
    res.status(400).json({ status: "error", error: err.message });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== req.body.password) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    res.json({ 
      status: "ok", 
      user: {
        _id: user._id,
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        joinDate: user.joinDate
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Profile routes
app.get("/profile/:id", RegisterController.getById);
app.put("/profile/:id", RegisterController.updateProfile);
app.delete("/profile/:id", RegisterController.deleteProfile);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Training Requests API Routes

// Submit new training request
app.post('/api/training-requests', async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ['memberName', 'contactNumber', 'coachId', 'trainingTopic', 'dateTime'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Create new request with default status
    const newRequest = new TrainingRequest({
      ...req.body,
      status: 'pending', // Set default status
      createdAt: new Date()
    });
    
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all training requests (for dashboard)
app.get('/api/training-requests', async (req, res) => {
  try {
    // Add optional filtering by status
    const { status, coachId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (coachId) filter.coachId = coachId;

    const requests = await TrainingRequest.find(filter)
      .sort({ createdAt: -1 });
      
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single training request
app.get('/api/training-requests/:id', async (req, res) => {
  try {
    const request = await TrainingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update request status and comments
app.put('/api/training-requests/:id', async (req, res) => {
  try {
    const { status, hrManagerComments } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedRequest = await TrainingRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        hrManagerComments,
        updatedAt: new Date() 
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a training request
app.delete('/api/training-requests/:id', async (req, res) => {
  try {
    const deletedRequest = await TrainingRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));