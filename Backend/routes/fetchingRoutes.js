const express = require("express");
const Hospital = require("../model/Hospital"); // Import the Hospital model
const Department=require("../model/Department");
const router = express.Router();
const User=require("../model/User");
const Appointment = require("../model/AppointmentHistory"); 
const Doctor = require("../model/Doctor");
const ImageData = require("../model/ImageData"); // Import Image Schema
const crypto = require("crypto");
const nodemailer = require("nodemailer");

router.get("/search", async (req, res) => {
    try {
      const { keyword } = req.query;
      console.log("query is ",req.query);
  
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
      }
  
      // Fetch hospital and department IDs matching the keyword
      const hospitals = await Hospital.find({ name: { $regex: keyword, $options: "i" } }).select("_id");
      const departments = await Department.find({ name: { $regex: keyword, $options: "i" } }).select("_id");
  
      // Search doctors by name, location, specialization, and hospital
      const doctors = await Doctor.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } }, // Match doctor name
          { location: { $regex: keyword, $options: "i" } }, // Match location
          { specialization: { $in: departments.map(d => d._id) } }, // Match department
          { hospital: { $in: hospitals.map(h => h._id) } } // Match hospital
        ]
      })
      .populate("specialization", "name") // Populate Department Name
      .populate("hospital", "name location"); // Populate Hospital Name & Location

      if (doctors.length === 0) {
        return res.status(404).json({ message: "No doctors found" });
      }

      const filtered_doctors = await Promise.all(
        doctors.map(async (doctor) => {
          const imageData = await ImageData.findOne({ doctorId: doctor._id }).sort({ _id: -1 });
      
          return {
            id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization?.name || "N/A",
            hospital: doctor.hospital?.name || "N/A",
            location: doctor.hospital?.location || "Unknown",
            qualification: doctor.qualification || "N/A",
            fee: doctor.fee || "Not provided",
            Slots: doctor.Slots,
            availability: doctor.availability,
            timeSlots: doctor.timeSlots,
            image: imageData ? imageData.image : null,  // ✅ Ensures even doctors without images are sent
          };
        })
      );
      //console.log(filtered_doctors);
  
      res.json(filtered_doctors);
    } catch (error) {
      console.error("Error searching doctors:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });


  router.post("/upload-image", async (req, res) => {
    try {
      const { image, doctorId } = req.body; // Get data from request
  
      if (!image || !doctorId) {
        return res.status(400).json({ message: "Both image and doctorId are required" });
      }
  
      const newImage = new ImageData({
        image, // Base64 string
        doctorId
      });
  
      await newImage.save();
      res.status(201).json({ message: "Image uploaded successfully!" });
  
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
  
    try {
      console.log("Email is ",email);
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      console.log("User found is ",user);
  
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Save OTP and expiry
      user.resetToken = otp;
      user.tokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
      user.markModified("resetToken");
      user.markModified("tokenExpiry");
      await user.save();
      console.log(`OTP is ${otp}`);
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "m40195634@gmail.com",       // your email
          pass: "zdwrzlkcvljvogpe",    // Gmail app password
        },
      });
  
      await transporter.sendMail({
        to: email,
        subject: "Your OTP for Password Reset",
        html: `<p>Your OTP is: <b>${otp}</b></p><p>This OTP is valid for 10 minutes.</p>`,
      });
  
      res.status(200).json({ message: "OTP sent to your email." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

  router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (user.resetToken !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  
      if (user.tokenExpiry < Date.now()) {
        return res.status(400).json({ message: "OTP has expired" });
      }
  
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  });
  

  router.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;
    console.log(req.body);
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      console.log(`User found is ${user}`);

      console.log(`new request is ${email} and otp is ${otp} and password is ${newPassword}`);
  
     // if (user.resetToken.toString() !== otp.toString()) {
      //  return res.status(400).json({ message: "Invalid OTP" });
     // }
      
     // if(user.tokenExpiry < Date.now()){
       // return res.status(400).json({ message: "OTP expired" });
     // }
  
      // Reset password
      user.password = newPassword; // ✅ Remember to hash this in production
      user.resetToken = undefined;
      user.tokenExpiry = undefined;
      await user.save();
  
      res.json({ message: "Password successfully reset", data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  router.delete("/delete-hospital/:id", async (req, res) => {
    const hospitalId = req.params.id;
    try{
      const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
     // 1. Find all doctors of the hospital
     const doctors = await Doctor.find({ hospital: hospitalId });

     // 2. Extract doctor IDs and their user IDs
     const doctorIds = doctors.map(doc => doc._id);
     const doctorUserIds = doctors.map(doc => doc.user);

     // 3. Delete images linked to doctors
    await ImageData.deleteMany({ doctor: { $in: doctorIds } });

    // 4. Delete user accounts of the doctors
    await User.deleteMany({ _id: { $in: doctorUserIds } });

    // 5. Delete doctors
    await Doctor.deleteMany({ hospital: hospitalId });

    // 6. Delete the hospital admin's user account
    await User.findByIdAndDelete(hospital.admin);

    // 7. Delete the hospital
    await Hospital.findByIdAndDelete(hospitalId);

    res.status(200).json({ message: 'Hospital, admin, doctors, their user accounts, and doctor images deleted successfully' });

    }catch(err){
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }



  })
  
  
  
  module.exports = router; 