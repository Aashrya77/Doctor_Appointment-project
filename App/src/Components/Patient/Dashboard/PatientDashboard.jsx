import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PatientDashboard.css';
import axios from "axios";
import { AiOutlineUser, AiOutlineSchedule } from "react-icons/ai";
import { FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [patient, setpatient] = useState('')

  useGSAP(() => {
    gsap.from('.ani', {
      y: -20,
      opacity: 0,
      stagger: .3,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.dashboard-header',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    gsap.fromTo('.quick-links-section a, .quick-links-section button', {
      y: -20,
      opacity: 0,
      
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.quick-link',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }, {
      opacity: 1,stagger: .3,
      y: 0
    })
    gsap.fromTo('.appointment-card', {
      y: -20,
      opacity: 0,
      
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: 'appointment-card',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }, {
      opacity: 1,stagger: .3,
      y: 0
    })
  })

  const fetchApprovedAppointments = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments', {
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
      const response = await axios.get('https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/profile', {
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
      <div className="dashboard-header ani">
        <h1>Welcome back, {patient ? patient.split(" ")[0] : "Loading..."}!</h1>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="appointments-section">
        <h2 className="ani">Upcoming Appointments</h2>
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
    </div>
  );

}

export default PatientDashboard;