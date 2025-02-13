import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GetAppointment.css";

const Appointment = ({ appointment, onApprove, onReject }) => {
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
  
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
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
    </div>
  );
};

export default AppointmentList;
