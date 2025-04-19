const express = require('express');
const connectDB = require("./db");
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes"); // Import auth routes
const hospitalRoutes=require("./routes/hospitalRoutes")//Import hospital routes
const doctorRoutes=require("./routes/doctorRoutes")//Import doctor routes
const fetchingRoutes=require("./routes/fetchingRoutes")//Import doctor routes




require("dotenv").config(); // Load environment variables
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

// Use authentication routes
app.use("/auth", authRoutes);

// adding hospital by admin
app.use("/hospital",hospitalRoutes);

// adding doctor by admin
app.use("/doctor",doctorRoutes);

app.use("/feature",fetchingRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
