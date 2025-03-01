import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faHome, faCalendarCheck, faClipboardList, faUser, faSignOutAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";



import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)

const Dashboard = () => {
  const [doctor, setDoctor] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [pending, setPending] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, []);

  useGSAP(() => {
    gsap.from('.header-ani', {
      y: -20,
      opacity: 0,
      stagger: .2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.header-ani',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    gsap.from('.sidebar ul li', {
      delay: .3,
      stagger: .2,
      opacity: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.sidebar',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    gsap.from('.stat-box', {
      delay: .3,
      stagger: .2,
      opacity: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    gsap.from('.appointments-list li', {
      delay: .3,
      stagger: .4,
      opacity: 0,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.appointments-list li p',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
  })
 


  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctor(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPending(data.appointments.filter((appointment) => appointment.status === "pending"));
      setAppointments(data.appointments.filter((appointment) => appointment.status === "approved"));
    } catch (error) {
      console.error("Failed to fetch appointments");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/register";
  };

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
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>


        <h2 className="header-ani">Doctor's Dashboard</h2>

        <ul>
          <li onClick={() => navigate("/")}> <FontAwesomeIcon icon={faHome} className="icon" /> Home</li>
          <li onClick={() => navigate("/appointments")}><FontAwesomeIcon icon={faCalendarCheck} className="icon" /> Appointments</li>
          <li onClick={() => navigate("/schedule")}><FontAwesomeIcon icon={faClipboardList} className="icon" /> Schedule</li>
          <li onClick={() => navigate("/profile")}><FontAwesomeIcon icon={faUser} className="icon" /> Your Profile</li>
          <li className="logout" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} className="icon" /> Logout</li>
        </ul>
      </aside>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <main className="main-content">



      <header className="dashboard-header header-ani">
  <h1>Welcome back, Dr. {doctor.name ? doctor.name.split(" ")[0] : "Loading..."}</h1>
  <p className="subheading header-ani">Here's an overview of your upcoming appointments</p>
</header>

        <section className="stats-section">
          <div className="stat-box"><FontAwesomeIcon icon={faClock} className="icon" /> <h3>Upcoming Appointments</h3><p>{appointments.length}</p></div>
          <div className="stat-box"><FontAwesomeIcon icon={faCalendarCheck} className="icon" /> <h3>Pending Appointments</h3><p>{pending.length}</p></div>
        </section>
        <section className="appointments-section">
          <h2>Upcoming Appointments</h2>
          <ul className="appointments-list">
            {appointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              appointments.map((appointment) => (
                <li key={appointment.id} className="appointment-item">
                  <p><strong>Patient:</strong> {appointment.patientId.name}</p>
                  <p><strong>Time:</strong> {formatDate(appointment.slot)}</p>
                  <p style={{ textTransform: 'capitalize' }}>
                    <strong>Status:</strong>
                    <span style={{ color: '#218838' }}> {appointment.status}</span>
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
