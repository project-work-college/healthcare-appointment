const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'hospitalAdmin', 'doctor', 'patient'],  
    default: 'patient' // Default role
  },
  hospital: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Hospital",
    required: function () {
      return this.role === "hospitalAdmin"; // Required only for hospital admins
    }
  },
  resetToken: { 
    type: String
  },

tokenExpiry: {
  type: Date

},

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: function () {
      return this.role === "doctor"; // Only required for doctors
    }
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "AppointmentHistory" }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
