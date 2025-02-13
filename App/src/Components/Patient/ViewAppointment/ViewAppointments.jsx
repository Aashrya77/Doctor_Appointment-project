import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewAppointments.css";
import { useNavigate } from "react-router-dom";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5500/api/v1/appointments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAppointments(response.data.appointments);
      setLoading(false);
    } catch (err) {
      setError("Failed to load appointments");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle canceling an appointment
  const handleCancel = async (appointmentId, doctor) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication error: No token found");
        return;
      }

      const response = await axios.put(
        `http://localhost:5500/api/v1/cancel-appointment/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Appointment Successfully cancelled with Dr. ${doctor}`);
      fetchAppointments();
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.msg === "Appointment already cancelled/rejected"
      ) {
        setError("Appointment already cancelled/rejected");
        return;
      }

      setError("Failed to cancel appointment");
    }
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
      hour12: true, // AM/PM
    });
  };

  return (
    <div className="view-appointments">
      <h2>Your Appointments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : appointments.length === 0 ? (
        <>
          <p>You have no appointments booked yet.</p>
          <button
            className="book-btn"
            onClick={() => navigate("/book-appointment")}
          >
            Book Appointment
          </button>
        </>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div className="appointment-card" key={appointment._id}>
              <p>
                <strong>Doctor:</strong> {appointment.doctorId.name}
              </p>
              <p>
                <strong>Appointment time:</strong>{" "}
                {formatDate(appointment.slot)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </p>
              {appointment.status === "cancelled" ||
              appointment.status === "rejected" ? (
                <p>Appointment is {appointment.status}</p>
              ) : (
                <button
                  className="cancel-btn"
                  onClick={() =>
                    handleCancel(appointment._id, appointment.doctorId.name)
                  }
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAppointments;
