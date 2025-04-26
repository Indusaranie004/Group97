const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const coachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Coach = mongoose.model('Coach', coachSchema);
module.exports = Coach;


const Coach = require('./Model/Coach');  // This path should be correct
