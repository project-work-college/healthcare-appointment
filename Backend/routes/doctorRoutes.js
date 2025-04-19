const express = require("express");
const Hospital = require("../model/Hospital");
const Doctor = require("../model/Doctor");
const Appointment = require("../model/AppointmentHistory");
const User = require("../model/User");
const Department = require("../model/Department");
const ImageData = require("../model/ImageData"); // Import Image Schema
const router = express.Router();
const { sendWelcomeEmail } = require("./emailService"); // Import email service
//const { splitTimeSlots } = require("./timeUtils");

router.use(express.json());  // Required for parsing JSON request bodies

function splitTimeSlots(slots, interval = 30) {
    const allSlots = [];

    slots.forEach(slot => {
        const [startTime, endTime] = slot.split(/\s*-\s*/).map(time => time.trim());
        allSlots.push(...generateTimeSlots(startTime, endTime, interval));
    });

    return allSlots;
}

function generateTimeSlots(startTime, endTime, interval) {
    const slots = [];
    let current = new Date(`1970-01-01T${convertTo24Hour(startTime)}`);
    const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}`);

    while (current < end) {
        let next = new Date(current);
        next.setMinutes(current.getMinutes() + interval);

        slots.push({ start: formatTime(current), end: formatTime(next) });

        current = next;
    }
    return slots;
}

// Convert 12-hour format (AM/PM) to 24-hour format
function convertTo24Hour(time) {
    let [hour, minute = "00"] = time.match(/\d+/g); // Default to "00" if minutes are missing
    let ampm = time.includes("PM") ? "PM" : "AM";
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

// Format time to 12-hour format
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}



// GET doctors with filtering
router.get("/doctors/:specialization?", async (req, res) => {
    try {
        //console.log("Filter:", req.params);
        const { specialization } = req.params;

        let filter = {};

        if (specialization) {
            // Find the corresponding department
            const departments = await Department.find({ name: specialization });

            if (!departments || departments.length === 0) {
                return res.status(404).json({ error: "No departments found with that name" });
            }

            const departmentIds = departments.map((dept) => dept._id);
            filter.specialization = { $in: departmentIds };
        }

        // Fetch doctors based on the filter (all doctors if no specialization)
        const doctors = await Doctor.find(filter)
            .populate("specialization", "name")
            .populate("hospital", "name location");

        if (doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found" });
        }


        // Fetch doctor images separately (Ensuring all doctors are included)
        const doctorsWithImages = await Promise.all(
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
        res.json(doctorsWithImages);

    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Error fetching doctors" });
    }
});

// Add doctor
router.post("/adddoctor", async (req, res) => {
    try {
        console.log("data is ", req.body);
        const { name, specialization, location, qualification, year, Slots, hospital, fee, availability, username, email, password, image } = req.body;
        if (!specialization) {
            return res.status(400).json({ error: "Specialization is missing in the request." });
        }

        // Check if the hospital exists
        const hospitalExists = await Hospital.findOne({ _id: hospital }).populate("departments");;
        if (!hospitalExists) {
            return res.status(400).json({ error: `Hospital '${hospital}' not found. Please register the hospital first.` });
        }
        console.log("✅ Hospital found:", hospitalExists.name, "Departments:", hospitalExists.departments);

        // Find the department by name (client-side sends department as a name, not ID)
        const departmentExists = hospitalExists.departments.find(dep => dep.name === specialization);
        if (!departmentExists) {
            return res.status(400).json({ error: `Department '${specialization}' not found in this hospital.` });
        }
        console.log("✅ Department found:", departmentExists.name);



        // Extract 'Slots' from request and split into 30-min intervals
        console.log("🔹 Raw Slots Received:", Slots);
        if (!Array.isArray(Slots)) {
            console.error("❌ Error: Slots is not an array!", Slots);
            return res.status(400).json({ error: "Invalid format for Slots. Expected an array." });
        }
        console.log("✅ Slots format is correct.");
        const slots = req.body.Slots && req.body.Slots.length > 0 ? req.body.Slots : [];
        if (slots) {
            console.log("fine ", slots);
        }

        const timeSlots = splitTimeSlots(slots);
        console.log("🔹 Processed Slots Array:", timeSlots);

        // Create new doctor
        const newDoctor = new Doctor({
            name,
            specialization: departmentExists._id,
            location,
            qualification,
            year,
            Slots,
            fee,
            hospital: hospitalExists._id,
            availability,
            timeSlots // Link doctor to user
        });



        await newDoctor.save();

        const newUser = new User({
            username,
            email,
            password,
            role: "doctor",
            doctor: newDoctor._id // Assuming you have a role field
        });

        await newUser.save();

        newDoctor.user = newUser._id;
        await newDoctor.save();


        if (image) {

            const newImageData = new ImageData({
                image,
                doctorId: newDoctor._id
            });

            await newImageData.save();
        }



        console.log("✅ User created:", newUser.username);
        const doctorId = newDoctor._id;
        console.log("✅ Doctor added:", newDoctor, "Id is ", doctorId);
        await sendWelcomeEmail(email, name, username, password, hospitalExists.name);


        res.status(201).json({ newDoctor, doctor_id: doctorId });
    } catch (error) {
        res.status(500).json({ error: "Error adding doctor", details: error.message });
    }
});

router.post("/doctor-username-password", async (req, res) => {
    try {
        const { username, password, doctorId, email } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email is already taken" });
        }
        let user;
        if (doctor.user) {
            // ✅ If doctor already has a user, update credentials
            user = await User.findById(doctor.user);
            if (!user) {
                return res.status(404).json({ message: "Associated user not found" });
            }
            user.username = username;
            user.password = hashedPassword;
            user.email = email;
        } else {
            // ✅ If doctor.user is null, create a new user
            user = new User({
                username,
                password,
                email,
                role: "doctor",
                doctor: doctorId // ✅ Ensure role is set
            });
            // Save the new user
            await user.save();
            // ✅ Link the new user to the doctor
            doctor.user = user._id;
        }
        // Save updated doctor record
        await doctor.save();

        res.status(200).json({ message: "Username and password assigned successfully" });



    }
    catch (error) {
        console.error("Error assigning credentials:", error);
        res.status(500).json({ message: "Internal Server Error" });

    }



});

router.delete("/delete-doctor/:doctorId", async (req, res) => {
    try {
        const { doctorId } = req.params;
        // Find the doctor
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        // Delete associated user if exists
        if (doctor.user) {
            await User.findByIdAndDelete(doctor.user);
        }
        // Delete the doctor
        await Doctor.findByIdAndDelete(doctorId);

        res.status(200).json({ message: "Doctor deleted successfully" });



    } catch (error) {
        console.error("Error deletion:", error);
        res.status(500).json({ error: "error occured" });

    }




});

router.post("/bookappointment", async (req, res) => {
    try {  // Extract data from the request body
        console.log("data is ", req.body);
        const { patientId, doctor, hospital, appointmentDateTime } = req.body;

        // Validate required fields
        if (!patientId || !appointmentDateTime || !doctor || !hospital) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the patient by ID
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        const hospitalData = await Hospital.findOne({ name: hospital });
        if (!hospitalData) {
            return res.status(404).json({ message: "Hospital not found" });
        }
        const hospitalId = hospitalData._id; // ✅ Get hospital ID

        // ✅ Find the doctor by ID
        const doctorData = await Doctor.findById(doctor);
        if (!doctorData) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Create a new appointment
        const newAppointment = new Appointment({
            patient: patientId, // Correct field name
            doctor, // Ensure doctor ID is passed correctly
            hospital: hospitalId, // Ensure hospital ID is passed correctly
            appointmentDateTime, // Combined Date & Time
        });


        // Save the new appointment to the database
        await newAppointment.save();

        // Add the appointment ID to the user's (patient's) appointments array
        patient.appointments.push(newAppointment._id);
        await patient.save(); // Save the updated user document

        hospitalData.appointments.push(newAppointment._id);
        await hospitalData.save(); // ✅ Save the updated hospital document

        doctorData.appointmentHistory.push(newAppointment._id);
        await doctorData.save(); // ✅ Save the updated doctor document

        // Return a success response with the new appointment details
        res.status(201).json({
            message: "Appointment booked successfully",
            appointmentId: newAppointment._id, // Explicitly sending appointmentId
            appointment: newAppointment,
            patient: patient,
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/history/:patientId", async (req, res) => {
    try {
        console.log("query data", req.params);
        const { patientId } = req.params;
        if (!patientId) {
            return res.status(400).json({ message: "Missing patient ID" });
        }
        const currentTime = new Date(); // Get current date and time
        let appointments = await Appointment.find({ patient: patientId });

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        // Update status in database if needed
        for (let app of appointments) {
            const appointmentDateTime = new Date(app.appointmentDateTime);

            let updatedStatus = appointmentDateTime <= currentTime ? "Completed" : "Confirmed";

            if (app.status !== updatedStatus && app.status !== "Completed" && app.status !== "Cancelled") {
                await Appointment.updateOne({ _id: app._id }, { $set: { status: updatedStatus } });
            }
        }


        appointments = await Appointment.find({ patient: patientId })
            .populate({
                path: "doctor",
                select: "name fee location",
                match: { name: { $exists: true, $ne: null } },
            })  // Populate only 'name' and 'fee' from doctor
            .populate("hospital", "name location")  // Populate only 'name' from hospital
            .populate("patient", "username") // Populate only 'name' from patient
            .select("appointmentDateTime doctor hospital patient status") // Select only required fields
            .sort({ appointmentDateTime: -1 }); // ✅ Sort by latest first
        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }

        appointments = appointments.filter(app => app.doctor !== null);

        const formattedAppointments = appointments.map(app => {
            const appointmentDateTime = new Date(app.appointmentDateTime); // Convert ISO string to Date object

            return {
                _id: app._id,  // Add this line
                doctorName: app.doctor?.name || "Unknown",
                location: app.hospital?.location || "Unknown",
                fee: app.doctor?.fee || "NA",
                hospitalName: app.hospital?.name || "Unknown",
                appointmentDate: appointmentDateTime.toISOString().split("T")[0].split("-").reverse().join("-"), // Extract YYYY-MM-DD
                appointmentTime: appointmentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), // Extract HH:MM AM/PM
                status: app.status
            };
        });
        const patientName = appointments.length > 0 ? appointments[0]?.patient?.username : "Unknown";

        //console.log("hi everything is ok");
        console.log(patientName);
        console.log(formattedAppointments[0]);

        // Send the formatted response
        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments: formattedAppointments,
            patientName: patientName,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching appointments", error: error.message });
    }




});

router.get("/checkslots", async (req, res) => {
    try {
        console.log("recieved ", req.query);
        let { appointmentDateTime, doctorId } = req.query;

        if (!appointmentDateTime) {
            return res.status(400).json({ message: "Appointment date and time required" });
        } else if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID required" });



        }
        appointmentDateTime = decodeURIComponent(appointmentDateTime); // Decode URI component
        // Fix: Remove extra spaces and replace incorrect format
        appointmentDateTime = appointmentDateTime.replace(/\s(?=\d{2}:\d{2}$)/, "+"); // Fix timezone formatting

        // Convert appointmentDateTime to a Date object
        const parsedDate = new Date(appointmentDateTime);
        console.log("Parsed Date:", parsedDate);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid appointment date format" });
        }

        // Count existing appointments for the requested date & time
        const existingAppointments = await Appointment.countDocuments({
            appointmentDateTime: parsedDate,
            doctor: doctorId,
            status: "Confirmed"

        });

        const nowUTC = new Date(); // Get current time in UTC
        console.log("current time is", nowUTC.toISOString()); // Example: "2025-03-10T12:34:56.789Z"
        let isSlotAvailable = false;
        if (parsedDate < nowUTC) {
            isSlotAvailable = false;
        } else {
            isSlotAvailable = existingAppointments < 5;
        }





        res.json({ isSlotAvailable, totalBookings: existingAppointments });
    } catch (error) {
        console.error("Error checking slot availability:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }


});


router.post("/submit", async (req, res) => {
    try {
        console.log("recieved data is", req.body);
        const { appointmentId, name, age, symptoms } = req.body;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Not found" });
        }



        appointment.name = name;
        appointment.age = age;
        appointment.symptoms = symptoms;
        await appointment.save();
        res.status(201).json({
            message: "Appointment booked successfully",
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching appointments", error: error.message });
    }

});

router.get("/doctor-details/:doctorId", async (req, res) => {
    try {
        const { doctorId } = req.params;
        // Find the doctor
        const doctor = await Doctor.findById(doctorId)
            .populate("user", "username email")
            .populate("specialization", "name")
            .populate("hospital", "name");

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const responseData = {
            _id: doctor._id,
            name: doctor.name,
            specialization: doctor.specialization.name,
            qualification: doctor.qualification,
            experience: doctor.experience,
            fee: doctor.fee,
            availability: doctor.availability,
            Slots: doctor.Slots,
            location: doctor.location,
            hospital: doctor.hospital.name,
            user: doctor.user
                ? {
                    username: doctor.user.username,
                    email: doctor.user.email,
                }
                : null, // ✅ If user is missing, return `null`
        };

        res.status(200).json(responseData);



    } catch (error) {
        console.error("Error fetching doctor details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }


});

router.put("/edit-profile/:doctorId", async (req, res) => {
    const { doctorId } = req.params;
    const { location, availability, Slots, currentPassword, newPassword } = req.body;
    try {
        const doctor = await Doctor.findById(doctorId).populate("user", "username password");
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        console.log("Received request body:", req.body);

        const user = doctor.user;
        if (currentPassword && newPassword) {
            // 🔹 Compare as plain text
            if (currentPassword !== user.password) {
                return res.status(400).json({ message: "Incorrect password." });
            }

            // ❌ Do NOT hash the new password (not recommended)
            user.password = newPassword;
            await user.save();
        }

        const updatedData = {};
        if (location !== undefined) {
            updatedData.location = location;
        }
        if (availability !== undefined) {
            updatedData.availability = availability;
        }
        if (Slots != undefined) {
            if (!Array.isArray(Slots)) {
                console.error("❌ Error: Slots is not an array!", Slots);
                return res.status(400).json({ error: "Invalid format for Slots. Expected an array." });
            }
            updatedData.Slots = Slots;
            console.log("✅ Slots format is correct.");
            const slots = req.body.Slots && req.body.Slots.length > 0 ? req.body.Slots : [];
            if (slots) {
                console.log("fine ", slots);
            }

            const timeSlots = splitTimeSlots(slots);
            console.log("🔹 Processed Slots Array:", timeSlots);
            updatedData.timeSlots = timeSlots;
        }



        Object.assign(doctor, updatedData);
        await doctor.save();
        res.json({ message: "Profile updated successfully!", updatedDoctor: doctor });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });

    }


});


router.put("/cancel-appointment/:appointmentId", async (req, res) => {
    const { appointmentId } = req.params;
    try {
        // Find the appointment by patient ID and appointment date
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        appointment.status = "Cancelled";
        await appointment.save();

        res.status(200).json({ message: "Appointment cancelled successfully", appointment });
    } catch (error) {
        res.status(500).json({ error: "Error cancelling appointment", details: error.message });
    }



});


module.exports = router;
