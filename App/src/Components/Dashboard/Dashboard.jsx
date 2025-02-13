import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendarCheck, faUserInjured, faClipboardList, faCog, faSignOutAlt, faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);
  const navigate= useNavigate()

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctor(data);
    } catch (err) {
      console.error(err)
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPending(data.appointments.filter((appointment) => appointment.status === 'pending'));
      setAppointments(data.appointments.filter((appointment) => appointment.status === 'approved'));
    } catch (error) {
      console.error("Failed to fetch appointments");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/register';
  };

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, []);

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
      hour12: true, 
    });
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Doctor's Dashboard</h2>
        <ul>
          <li className="active"><FontAwesomeIcon icon={faHome} className="icon" /> Home</li>
          <li onClick={() => navigate('/appointments')}><FontAwesomeIcon icon={faCalendarCheck} className="icon" /> Appointments</li>
          <li onClick={() => navigate('/schedule')}><FontAwesomeIcon icon={faClipboardList} className="icon" /> Schedule</li>
          <li onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faUser} className="icon" /> Your Profile</li>
          <li className="logout" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, Dr. {doctor.name?.split(" ")[0]}</h1>
          <p>Your schedule for today</p>
        </header>
        <section className="stats-section">
          <div className="stat-box">
            <FontAwesomeIcon icon={faClock} className="icon" />
            <h3>Upcoming Appointments</h3>
            <p>{appointments.length}</p>
          </div>
          <div className="stat-box">
            <FontAwesomeIcon icon={faCalendarCheck} className="icon" />
            <h3>Pending Appointments</h3>
            <p>{pending.length}</p>
          </div>
        </section>
        <section className="schedule-section">
          <h2>Appointment Schedule</h2>
          <div className="appointment-list">
            {appointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <h3>{appointment.patientId.name}</h3>
                  <p><strong>Appointment Time: </strong>{formatDate(appointment.slot)}</p>
                  <span className={`status ${appointment.status}`}>{appointment.status}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
