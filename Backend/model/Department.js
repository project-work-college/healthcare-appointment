const mongoose = require("mongoose");


const departmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }
    // Removed doctors array
  });
  departmentSchema.index({ name: 1, hospital: 1 }, { unique: true });
  
  const Department = mongoose.model('Department', departmentSchema);
  module.exports = Department;
  