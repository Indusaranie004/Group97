const User = require('../Model/userModel');  // Ensure correct path to your model

// Create User (Signup)
exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Create user
        const newUser = new User({ name, email });
        await newUser.save();

        res.status(201).json(newUser);  // Return the new user
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: "Failed to create user" });
    }
};

// Read Users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users
        res.json(users);  // Return the list of users
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;  // Get user ID from params
        const { name, email } = req.body;  // Get updated user data from body

        // Find and update the user by ID
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });

        // If user not found, return error
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);  // Return the updated user
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: "Failed to update user" });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully" });  // Return success message
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ error: "Failed to delete user" });
    }
};
