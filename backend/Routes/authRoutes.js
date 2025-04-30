const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Coach = require('../Model/Coach');
const router = express.Router();

// Register Coach
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let coach = await Coach.findOne({ email });
    if (coach) {
      return res.status(400).json({ msg: 'Coach already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    coach = new Coach({
      name,
      email,
      password: hashedPassword, // Store hashed password
    });

    await coach.save();

    const payload = {
      coach: {
        id: coach._id,
        name: coach.name,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Coach
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    let coach = await Coach.findOne({ email });
    if (!coach) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, coach.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      coach: {
        id: coach._id,
        name: coach.name,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
