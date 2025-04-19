const nodemailer = require("nodemailer");
require("dotenv").config();  // Load environment variables from .env file

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendWelcomeEmail(email, doctorName, username, password, hospitalName) {
    const mailOptions = {
        from: "testapps42069@gmail.com",
        to: email,
        subject: `Welcome to ${hospitalName}!`,
        text: `Dear ${doctorName},\n\nWelcome to ${hospitalName}!\n\nYour login credentials are:\nUsername: ${username}\nPassword: ${password}\n\nPlease log in and update your details.\n\nBest regards,\n${hospitalName} Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Doctor welcome email sent to", email);
    } catch (error) {
        console.error("❌ Error sending doctor email:", error.message);
    }
}

async function sendWelcomeHospitalEmail(email, name, location, username, password) {
    const mailOptions = {
        from: `"Find My Dr" <m40195634@gmail.com>`,
        to: email,
        subject: `Welcome to Find My Dr, ${name}!`,
        html: `
      <h2>Welcome to Find My Dr!</h2>
      <p>Dear <strong>Team ${name}</strong>,</p>
      <p>Your hospital located at <strong>${location}</strong> has been successfully registered on our platform.</p>
      <p>Here are your login credentials:</p>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>Please keep these details safe. You can now log in and start managing your hospital's profile and doctors.</p>
      <br>
      <p>Best regards,<br>Find My Dr Team</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Hospital welcome email sent to", email);
    } catch (error) {
        console.error("❌ Error sending hospital email:", error.message);
    }
}

module.exports = {
    sendWelcomeEmail,
    sendWelcomeHospitalEmail
};
