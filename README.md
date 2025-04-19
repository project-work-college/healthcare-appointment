# Healthcare Appointment Booking System
A web application for Doctor-Patient Appointment System built with the MERN stack (MongoDB, Express.js, React, and Node.js). It simplifies the process of booking appointments, managing hospital profiles, and managing doctors and their schedules.

## Features
- **Patient Registration & Appointment Booking**: Patients can register, search for available doctors, and book appointments. Each appointment slot is limited to 5 patients to ensure proper attention.
- **Doctor & Department Management**: Hospitals can add doctors to specific departments and manage their availability for appointments.
- **Admin Dashboard**: Hospital admins can manage hospital profiles, doctor schedules, and patient bookings through an intuitive dashboard.
- **Automated Email Notifications**: Doctors and hospital admins receive automated emails with their login credentials and updates on their account status.

## Technologies Used
- **MongoDB**: NoSQL database for storing patient, doctor, and appointment data.
- **Express.js**: Web framework for Node.js to build the server-side application and manage routes.
- **React**: JavaScript library for building user interfaces, used to create the frontend of the system.
- **Node.js**: JavaScript runtime for building the backend and handling requests.
- **Nodemailer**: A package for sending automated email notifications.

## Installation
### 1. Clone the repository
```bash
git clone https://github.com/project-work-college/healthcare-appointment-booking.git
```
Navigate to the project folder and install the required dependencies for both the backend and frontend.
- **Backend (Node.js/Express)**:
  Navigate to the `backend` folder and install the backend dependencies:
  ```bash
  cd backend
  npm install
  ```
- **Frontend (React)**:
  Navigate to the `frontend` folder and install the frontend dependencies:
  ```bash
  cd frontend
  npm install
  ```
### 3. Set up Environment Variables
Create a `.env` file in the `backend` directory with the following environment variables:
```plaintext
MONGO_URI=your_mongo_db_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
### 4. Run the Application
After installing the dependencies and setting up the environment variables, you can run the application.
- **Backend**:
  Start the backend server by running the following:
  ```bash
  cd backend
  npm start
  ```
- **Frontend**:
  Start the frontend development server by running:
  ```bash
  cd frontend
  npm start
  ```

### 5. Contributing
Feel free to fork the repository, make changes, and create a pull request. For bug fixes or feature suggestions, open an issue.
