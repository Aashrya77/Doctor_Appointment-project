import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PatientDashboard.css';
import axios from "axios";
import { AiOutlineUser, AiOutlineSchedule } from "react-icons/ai";
import { FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";


const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [patient, setpatient] = useState('')

  const fetchApprovedAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5500/api/v1/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const approvedAppointments = response.data.appointments.filter(appointment => appointment.status === 'approved')
      setAppointments(approvedAppointments)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setpatient(response.data.name)
    } catch (error) {
      console.error(error)

      
    }
  }
  useEffect(() => {
    fetchApprovedAppointments()
    fetchProfile()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      timeZone: "UTC",
      weekday: "long",
      year: "numeric", 
      month: "long", 
      day: "numeric", 
      hour: "numeric",
      minute: "numeric",
      hour12: true, // AM/PM
    });
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/register"; 
  };
  

  return (
    <div className="patient-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {patient?.split(" ")[0]}!</h1>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <p className="no-appointments">You have no upcoming appointments.</p>
        ) : (
          appointments.map((appointment, index) => (
            <div className="appointment-card" key={index}>
              <div className="appointment-info">
                <p><strong>Doctor:</strong> {appointment.doctorId.name}</p>
                <p><strong>Appointment time:</strong> {formatDate(appointment.slot)}</p>
                <p><strong>Status:</strong> <span style={{textTransform: 'capitalize'}} className={`status ${appointment.status}`}>{appointment.status}</span></p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-section">
  <h2>Quick Links</h2>
  <div className="quick-links">
    <Link to="/profile" className="quick-link">
      <AiOutlineUser className="quick-link-icon" /> View Profile
    </Link>
    <Link to="/patient-appointments" className="quick-link">
      <FaCalendarAlt className="quick-link-icon" /> View All Appointments
    </Link>
    <Link to="/book-appointment" className="quick-link">
      <AiOutlineSchedule className="quick-link-icon" size={25}/> Schedule an Appointment
    </Link>
    <button className="quick-link logout-link" onClick={handleLogout}>
      <FaSignOutAlt className="quick-link-icon" /> Logout
    </button>
  </div>
</div>



    </div>
  );
};

export default PatientDashboard;
