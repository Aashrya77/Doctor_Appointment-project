import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthForm from "./Components/Auth/AuthForm";
import UserProfile from "./Components/UserProfile/UserProfile";
import Dashboard from "./Components/Dashboard/Dashboard";
import DoctorAvailability from "./Components/Appointments/Schedule/DoctorAvailability";
import HomeWelcome from "./Components/Home/HomeWelcome";
import PatientDashboard from "./Components/Patient/Dashboard/PatientDashboard";
import GetAppointments from "./Components/Appointments/GetAppointments(Doctor)/GetAppointments";
import ViewAppointments from "./Components/Patient/ViewAppointment/ViewAppointments";
import BookAppointment from "./Components/Patient/BookAppointment/BookAppointment";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleProtectedRoute from "./Components/RoleProtectedRoute";
import Unauthorized from "./Components/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWelcome />} />
      <Route path="/register" element={<AuthForm />} />
      <Route path="/unauthorized" element={<Unauthorized/>}/>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Role-Based Protected Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={["Patient"]} />}>
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/patient-appointments" element={<ViewAppointments />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
        </Route>

        <Route element={<RoleProtectedRoute allowedRoles={["Doctor"]} />}>
          <Route path="/appointments" element={<GetAppointments />} />
          <Route path="/schedule" element={<DoctorAvailability />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Common Protected Routes for all users */}
        <Route path="/profile" element={<UserProfile />} />
        
      </Route>

    </Routes>
  );
}

export default App;
