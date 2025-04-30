const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String },
  experience: { type: Number }
}, { timestamps: true });
module.exports = mongoose.model('Coach', coachSchema);

// Hash password before saving
coachSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Skip hashing if the password hasn't changed
  try {
    const salt = await bcrypt.genSalt(10);  // Generate salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
  } catch (error) {
    next(error);  // Pass errors to the next middleware
  }
});

// Compare entered password with stored hash
coachSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);  // Compare the entered password with the stored hash
};

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
