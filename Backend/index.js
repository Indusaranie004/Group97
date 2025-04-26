const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterController = require("./Controllers/RegisterControllers");


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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));