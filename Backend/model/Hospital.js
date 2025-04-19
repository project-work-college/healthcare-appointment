const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String,
       required: true, 
       unique: true },
    location: { type: String, 
      required: true },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }], // Associated doctors
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "AppointmentHistory" }], // Appointments linked to hospital
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }], // Stores department IDs
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Hospital admin
  }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital ;
