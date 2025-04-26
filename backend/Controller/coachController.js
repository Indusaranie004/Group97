import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Coach from '../Model/Coach.js';

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
      const coach = await Coach.findById(req.coach.id).select('-password');
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
      const updates = req.body;
      const coach = await Coach.findByIdAndUpdate(req.coach.id, updates, { new: true });

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
      const coach = await Coach.findByIdAndDelete(req.coach.id);
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      res.json({ message: "Coach profile deleted successfully" });
    } catch (error) {
      console.error("Delete Profile Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  exampleFunction: (req, res) => {
    res.send('This is an example function from coachController.');
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingCoach = await Coach.findOne({ email });
    if (existingCoach) {
      return res.status(400).json({ msg: 'Coach already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCoach = new Coach({
      name,
      email,
      password: hashedPassword,
    });

    await newCoach.save();
    res.status(201).json({ msg: 'Coach registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, coach.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.status(200).json({ msg: 'Signin successful', coach });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const getCoachProfile = (req, res) => {
  // Example implementation for getting coach profile
  res.json({ msg: 'Coach profile retrieved successfully', user: req.user });
};

export const updateCoachProfile = (req, res) => {
  // Example implementation for updating coach profile
  res.json({ msg: 'Coach profile updated successfully' });
};

export default coachController;
