# Doctor's Appointment Platform

This is a MERN stack web application that allows patients to book, cancel, and view appointments with doctors. Doctors can manage their availability, approve/reject appointments, and more.

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)


## Features
- **For Patients**:
  - Book, cancel, and view appointments
  - View profile and appointment status
  - Logout functionality

- **For Doctors**:
  - Set availability
  - Approve or reject patient appointments
  - View all appointments

## Folder Structure
The folder structure of the project is as follows:
```. ├── client/ # React frontend │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ ├── pages/ │ │ ├── App.jsx │ │ └── index.jsx ├── server/ # Node.js backend │ ├── controllers/ │ ├── model/ │ ├── routes/ │ ├── middleware/ │ ├── app.js ├── .env # Environment variables ├── package.json # Backend dependencies ├── client/package.json # Frontend dependencies └── README.md # This file```


## Setup Instructions

### Prerequisites

Before you can run the project, make sure you have the following installed:
- Node.js (LTS version recommended)
- npm (Node Package Manager)
- MongoDB instance (or use MongoDB Atlas for cloud storage)

### Backend Setup

1. Navigate to the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory with the following content:
    ```bash
    MONGO_URI=your_mongo_db_connection_string
    JWT_SECRET=your_secret_key
    PORT=5500
    ```
4. Start the backend server:
    ```bash
    npm start
    ```

### Frontend Setup

1. Navigate to the `App` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the frontend development server:
    ```bash
    npm run dev
    ```

### API Endpoints

### Authentication
- **POST /api/v1/auth/register**: Register a new user (patient/doctor)
- **POST /api/v1/auth/login**: Login a user and get a JWT token
- **GET /api/v1/auth/profile**: Get user profile (protected route)

### Appointments (Patients)
- **GET /api/v1/appointments**: Get all appointments (Patient's appointments)
- **POST /api/v1/appointments**: Book an appointment
- **PUT /api/v1/cancel-appointment/:id**: Cancel an appointment

### Doctor Availability (Doctors)
- **POST /api/v1/availability**: Set doctor availability
- **GET /api/v1/availability/:doctorId**: Get doctor's availability

### Appointments (Doctors)
- **GET /api/v1/appointments**: View all appointments (Doctor's appointments)
- **PUT /api/v1/appointment-status/:id**: Approve or reject an appointment

##

### Usage

### Patient's Workflow
1. Register as a patient and log in.
2. View available doctors and book an appointment.
3. View upcoming and past appointments.
4. Cancel an appointment if needed.

### Doctor's Workflow
1. Register as a doctor and log in.
2. Set availability for appointments.
3. View patients' appointment requests.
4. Approve or reject appointment requests.

##
### Testing the Application 
You can use Postman or Insomnia to test the API endpoints. Make sure to include the JWT token in the Authorization header as Bearer <your_token> for protected routes.# Doctor_Appointment
# Doctor_Appointment
# Doctor_Appointment
