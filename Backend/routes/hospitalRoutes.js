const express = require("express");
const Hospital = require("../model/Hospital"); // Import the Hospital model
const Department=require("../model/Department");
const router = express.Router();
const User=require("../model/User");
const Appointment = require("../model/AppointmentHistory"); 
const Doctor = require("../model/Doctor");
const moment = require("moment");
const { splitTimeSlots } = require("./timeUtils");
const sendWelcomeHospitalEmail=require("../routes/emailService").sendWelcomeHospitalEmail;
// Add a hospital
//not finalized just for reference
router.post("/addhospital", async (req, res) => {
    try {
      const { name, location,email,username,password } = req.body;
  
      const hospital = new Hospital({ name, location });
      await hospital.save();

      if (hospital.admin) {
        return res.status(400).json({ error: "This hospital already has an admin." });
      }
  
      // Create hospital admin user
      const newAdmin = new User({
        email,
        username,
        password,
        role: "hospitalAdmin",
        hospital: hospital._id
      });
  
      await newAdmin.save();
  
      // Assign the admin to the hospital
      hospital.admin = newAdmin._id;
      await hospital.save();

      //await sendWelcomeHospitalEmail(email, name,location, username, password);
      try {
        await sendWelcomeHospitalEmail(email, name, location, username, password);
      } catch (emailError) {
        console.error("⚠️ Email sending failed:", emailError.message);
        // Optional: Log error to DB or monitoring service
      }
  
  
      res.status(201).json({ message: "Hospital added successfully", hospital,admin: "New admin ",newAdmin });
    } catch (error) {
      res.status(500).json({ error: "Error adding hospital" });
    }
  });
  
  // Get all hospitals
  router.get("/", async (req, res) => {
    try {
      const hospitals = await Hospital.find().populate("admin", "name email");
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ error: "Error fetching hospitals" });
    }
  });
  
  // Get a single hospital by ID
  router.get("/:id", async (req, res) => {
    try {
      const hospital = await Hospital.findById(req.params.id).populate("admin", "name email");
      if (!hospital) return res.status(404).json({ error: "Hospital not found" });
  
      res.json(hospital);
    } catch (error) {
      res.status(500).json({ error: "Error fetching hospital" });
    }
  });


  //add department

  router.post("/add-department", async (req, res) => {
    try{
      console.log("Data received: ", req.body);
      const { hospital, name } = req.body; // hospital = hospital ID, name = department name
      // Check if the hospital exists
    const hospitalExists = await Hospital.findOne({ _id: hospital }).populate("departments");
    if (!hospitalExists) {
      return res.status(400).json({ error: `Hospital not found. Please register the hospital first.` });
    }
    // Check if the department already exists in this hospital
    const departmentExists = hospitalExists.departments.find(dep => dep.name === name);
    if (departmentExists) {
      return res.status(400).json({ error: `Department '${name}' already exists in this hospital.` });
    }
    // Create the department
    // Create a new department
    const newDepartment = new Department({
      name,
      hospital: hospitalExists._id
    });
    try{

    await newDepartment.save();
    }catch(error){
      console.log(error.message);
    }

    // Add department reference to hospital
    hospitalExists.departments.push(newDepartment._id);
    await hospitalExists.save();
    console.log(`Response is ${newDepartment}`);

    res.status(201).json(newDepartment);


    }catch(error){
      res.status(500).json({ error: "Error adding department", details: error.message });
    }


  });

  router.get("/departments/:hospitalId", async (req, res) => {
    try{
      const { hospitalId } = req.params;
      // Check if hospital exists
    const hospitalExists = await Hospital.findById(hospitalId);
    if (!hospitalExists) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // Fetch departments for the hospital
    const departments = await Department.find({ hospital: hospitalId });

    res.status(200).json(departments);
  }catch (error) {
      res.status(500).json({ error: "Error fetching departments", details: error.message });
    }


  });

  router.get("/appointment-list/:hospitalId", async (req, res) => {

    try{
      const { hospitalId } = req.params;
      // Check if hospital exists
    const hospitalExists = await Hospital.findById(hospitalId);
    if (!hospitalExists) {
      return res.status(404).json({ error: "Hospital not found" });
    
    }

    // ✅ Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate filtering


    // ✅ Fetch appointments for the hospital
    let appointments = await Appointment.find({
      hospital: hospitalId,
      appointmentDateTime: { $gte: today }, // Fetch future appointments
      status: "Confirmed", // Ensure only confirmed appointments
    })
      .populate({
        path: "doctor",
        select: "name specialization", // Fetch doctor's name and specialization
        populate: {
          path: "specialization",
          model: "Department",
          select: "name", // Fetch department name
        },
      })
      .populate("patient", "username email") // Fetch patient details
      .sort({ appointmentDateTime: 1 }); // Sort by earliest appointments first
    

    // Fetch appointments for the hospital

    appointments = appointments.filter(appointment => appointment.doctor && appointment.doctor.name && appointment.name);

    // ✅ Transform data to return only required fields
    const formattedAppointments = appointments.map(appointment => {
      const appointmentDate = new Date(appointment.appointmentDateTime);
      
      return {
        patientName: appointment.name || "Unknown",
        age: appointment.age || "N/A",
        doctorName: appointment.doctor?.name || "Unknown",
        department: appointment.doctor?.specialization?.name || "N/A",
        appointmentDate: appointmentDate.toISOString().split("T")[0], // Extracts YYYY-MM-DD
        appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }) // Extracts HH:MM AM/PM
      };
    });


    if (formattedAppointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this hospital." });
    }

    res.status(200).json(formattedAppointments);

  }catch (error) {
      res.status(500).json({ error: "Error fetching appointments", details: error.message });
    }

  });

  

  router.post("/register-doctor-username", async (req, res) => {
    try {
      const { email, username, password, hospitalId,doctorId } = req.body;

      // Check if the hospital exists
      const hospitalExists = await Hospital.findById(hospitalId);
      if (!hospitalExists) {
        return res.status(400).json({ error: "Hospital not found" });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken. Choose another username." });
            }


      // Create doctor user
      const newDoctor = new User({
        username,
        password,
        role: "doctor",
        hospital: hospitalId,
        doctor:doctorId,
      });

      await newDoctor.save();

      // Add doctor to the hospital
      hospitalExists.doctors.push(newDoctor._id);
      await hospitalExists.save();

      res.status(201).json(newDoctor);
    } catch (error) {
      res.status(500).json({ error: "Error creating doctor", details: error.message });
    }
  });

  router.get("/doctor-hospital-admin/:hospital/:specialization",async (req,res) =>{
    try{
    const { specialization, hospital } = req.params;
     // Ensure specialization is provided
     if (!specialization) {
      return res.status(400).json({ error: "Specialization is required." });
    }

    // ✅ Check if the hospital exists
    const hospitalExists = await Hospital.findById(hospital).populate("departments");
    if (!hospitalExists) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const departmentExists = hospitalExists.departments.find(dep => dep.name === specialization);
    if (!departmentExists) {
      return res.status(404).json({ message: `Department '${specialization}' not found in this hospital.` });
    }
    
    const filter = {
      specialization: departmentExists._id,
      hospital: hospital
    };

    // ✅ Find doctors only in the given department and hospital
    const doctors = await Doctor.find(filter)
      .populate("specialization", "name") // Fetch department name
      .populate("hospital", "name location") // Fetch hospital details
      .populate("user", "username email password");

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this department in this hospital." });
    }

    const filteredDoctors = doctors.map(doctor => {
      return {
        id:doctor._id,
        name: doctor.name,
        qualification:doctor.qualification,
        specialization: doctor.specialization.name,
        location: doctor.location,
        Slots: doctor.Slots,
        availability: doctor.availability,
        user: doctor.user ? {
          username: doctor.user.username,
          email: doctor.user.email,
          password:doctor.user.password
        } : null // ✅ Handles missing user data
      };
    });

    res.json(filteredDoctors);

    }catch(error){
      res.status(500).json({ error: "Error fetching doctors", details: error.message });
    }



  });

  router.get("/doctor-appointment-history/:doctorId", async (req, res) => {

    try{
      const { doctorId } = req.params;
      // Check if doctor exists
    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // ✅ Get today's date at 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part for accurate filtering


    // ✅ Fetch appointments for the hospital
    let appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDateTime: { $gte: today },
      status: "Confirmed" // ✅ Fetch upcoming appointments
    })
      .populate("doctor", "name") // ✅ Fetch doctor name
      .sort({ appointmentDateTime: 1 }); // ✅ Sort by upcoming appointments

    // ✅ Handle case where no appointments are found
    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor." });
    }
    const formattedAppointments = appointments.map((appointment) => {
      const appointmentDate = new Date(appointment.appointmentDateTime);

      return {
        _id: appointment._id,
        patientName: appointment.name || "Unknown", // ✅ Uses name from Appointment model
        age: appointment.age || "N/A", // ✅ Uses age from Appointment model
        doctorName: appointment.doctor?.name || "Unknown",
        appointmentDate: appointmentDate.toISOString().split("T")[0],
        symptom: appointment.symptoms, // ✅ Extracts YYYY-MM-DD
        appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }), // ✅ Extracts HH:MM AM/PM
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ error: "Error fetching appointments", details: error.message });
  }
  });

  router.delete("/delete-department/:dept_id",async (req,res)=>{
    try{
      const { dept_id } = req.params;

      // Find the department
      const department = await Department.findById(dept_id);
      if (!department) {
          return res.status(400).json({ message: "Department not found" });
      }

     
      // Check if any doctors are associated with this department
      const doctors = await Doctor.find({ specialization: dept_id });
      if (doctors.length > 0) {
          return res.status(400).json({ message: "Cannot delete department with assigned doctors" });
      }

      await Department.findByIdAndDelete(dept_id);

      res.status(200).json({ message: "Department deleted successfully" });

  

    }catch(error){
      console.log("some error happened ",error);
      res.status(500).json({ error: "Error in deleting department", details: error.message });
    }


  });

  router.put("/doctor-details/:doctorId",async (req,res)=>{
    const { doctorId } = req.params;
    const {email,location,qualification,availability,Slots } = req.body;
    console.log("Data recieved : ",req.body);
    console.log("user id ",doctorId);
    try{
     const doctor = await Doctor.findById(doctorId).populate("user", "username password email");
     if (!doctor) return res.status(404).json({ message: "Doctor not found" });

     const user = doctor.user;
     if(user.email && email){
      user.email = email;
      await user.save();
     }

     const updatedData={};
     const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

     if (location !== undefined && doctor?.location !== location && location.trim() !== "") {
      updatedData.location = location;
    }

    if (availability !== undefined && Array.isArray(availability)) {
      // Sort the new availability according to predefined week order
      const updatedAvailability = [...availability].sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));
    
      // Check if there's an actual change before updating
      if (JSON.stringify(doctor.availability.sort()) !== JSON.stringify(updatedAvailability)) {
        updatedData.availability = updatedAvailability;  // ✅ Fully replacing the existing availability
      }
    }
    
    if(qualification!=undefined){
      updatedData.qualification=qualification;
    }

    if (Slots!==undefined) {
      if (!Array.isArray(Slots)) {
        console.error("❌ Error: Slots is not an array!", Slots);
        return res.status(400).json({ error: "Invalid format for Slots. Expected an array." });
      }
        updatedData.Slots = Slots;
        console.log("✅ Slots format is correct.");
    const slots = req.body.Slots && req.body.Slots.length > 0 ? req.body.Slots : null;
    if(slots){
      console.log("fine ",slots);
      const timeSlots = splitTimeSlots(slots);
      console.log("🔹 Processed Slots Array:", timeSlots);
      updatedData.timeSlots = timeSlots;
    }
    
   
    }

    Object.assign(doctor, updatedData);
    await doctor.save();
    res.json({ message: "Profile updated successfully!", updatedDoctor: doctor });
    

    }catch(error){
      console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
    }

  });
  

  
  
  module.exports = router;