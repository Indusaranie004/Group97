const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffmembersSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    validate: {
      validator: function(v) {
        return !v.includes('@');
      },
      message: "Name cannot contain '@' symbol"
    }
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Please fill a valid phone number"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["HR Manager", "Staff", "Admin"],
    default: "Staff"
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Register", staffmembersSchema);