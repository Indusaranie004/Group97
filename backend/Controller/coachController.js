const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Coach = require('../Model/Coach');
const { default: mongoose } = require('mongoose');

const coachController = {
  // Coach Signup
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      let coach = await Coach.findOne({ email });
      if (coach) {
        return res.status(400).json({ message: "Coach already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      coach = new Coach({ name, email, password: hashedPassword });

      await coach.save();
      res.status(201).json({ message: "Coach registered successfully" });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Coach Signin
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const coach = await Coach.findOne({ email });
      if (!coach) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, coach.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: coach._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        token,
        coach: { id: coach._id, name: coach.name, email: coach.email },
      });
    } catch (error) {
      console.error("Signin Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Fetch Coach Profile
  getCoachProfile: async (req, res) => {
    try {
      const coach = await Coach.findById(req.body._id).select('-password');
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      res.json(coach);
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Update Coach Profile
  updateCoachProfile: async (req, res) => {
    try {
      if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid coach ID" });
      }
      const updates = req.body;
      const coach = await Coach.findByIdAndUpdate(
        req.params.id, // Using _id instead of id
        updates, 
        { new: true }
      );

      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }

      res.json(coach);
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Delete Coach Profile
  deleteCoachProfile: async (req, res) => {
    try {
      const coach = await Coach.findByIdAndDelete(req.params.id);
      
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      res.json({ message: "Coach profile deleted successfully" });
    } catch (error) {
      console.error("Delete Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }, 

  getAllCoaches: async (req, res) => {
    try {
      const coaches = await Coach.find().select('-password');
      res.json(coaches);
    } catch (error) {
      console.error("Get All Coaches Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = coachController;
