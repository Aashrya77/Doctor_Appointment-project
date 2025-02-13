import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GetAppointment.css";
import gsap from 'gsap'
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)

const Appointment = ({ appointment, onApprove, onReject }) => {

  useGSAP(() => {
    gsap.fromTo('.appointment-card', 
      { y: -20, opacity: 0 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.4,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: '.appointment-card',
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
  


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

  return (
    <div className="appointment-card">
      <div className="appointment-details">
        <h3>{appointment.patientId.name}</h3>
        <p>
          <strong>Appointment Time: </strong>
          {formatDate(appointment.slot)}
        </p>
        <p>
          <strong>Status:</strong>
          <span className={`status ${appointment.status}`}>
            {"   "} {appointment.status}
          </span>
        </p>
      </div>

      {appointment.status === "cancelled" || appointment.status === "approved" || appointment.status === 'rejected' ? (
        <div className="appointment-actions">
          <p>Appointment {appointment.status}</p>
        </div>
      ) : (
        <div className="appointment-actions">
          <button className="view-details" onClick={() => onApprove(appointment._id)}>
            Approve
          </button>
          <button className="edit-appointment" onClick={() => onReject(appointment._id)}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);  


  useGSAP(() => {
    gsap.from('.appointments-section h2', {
      y: -20,
      opacity: 0,
      stagger: .2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '.appointments-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
  })

  
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.appointments);
      setLoading(false);  
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      setLoading(false);  
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointment-status/${id}`,
        { status: "approved" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("You approved the appointment successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to approve appointment", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointment-status/${id}`,
        { status: "rejected" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("You rejected the appointment successfully.");
      fetchAppointments();
    } catch (error) {
      console.error("Failed to reject appointment", error);
    }
  };

  return (
    <div className="appointments-section">
      <h2>Appointments</h2>

      {/* Show loading state if appointments are still being fetched */}
      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : (
        <div className="appointments-list">
          {appointments.length === 0 ? (
            <p>No appointments scheduled.</p>
          ) : (
            appointments.map((appointment) => (
              <Appointment
                key={appointment._id}
                appointment={appointment}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;