import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookAppointment.css";

const BookAppointment = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctor, setDoctor] = useState('')
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  // Fetch available slots from the backend
  const fetchAvailableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://doctor-appointment-backend-tim3.onrender.com/api/v1/available-slots",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvailableSlots(response.data.doctorSlots);
    } catch (error) {
      console.error("Error fetching available slots", error);
    }
  };

  // Book an appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot) {
      setMessage("Please select a doctor and a time slot first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://doctor-appointment-backend-tim3.onrender.com/api/v1/appointments",
        {
          doctorId: selectedDoctor,
          slot: selectedSlot, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     
      setMessage(response.data.msg || "Appointment booked successfully!");
    } catch (error) {
      setMessage("Error booking appointment.");
      console.error("Error booking appointment", error);
    }
  };

  return (
    <div className="book-appointment-container">
      <h1>Book an Appointment</h1>

      {/* Display available slots */}
      <div className="available-slots">
        <h2>Available Appointment Slots</h2>
        {availableSlots.length === 0 ? (
          <p>No available slots at the moment.</p>
        ) : (
          availableSlots.map((doctor) => (
            <div key={doctor.doctorId} className="doctor-card">
              <h3>Dr. {doctor.doctorName}</h3>
              {doctor.availableSlots.length === 0 ? <p>No available slots for the doctor</p> : 
               doctor.availableSlots.map((slot) => (
                <div key={slot._id} className="date-card">
                  <p>{slot.date}</p>
                  {slot.timeSlots.map((time) => {
                    const isoDateTime = new Date(`${slot.date}T${time}Z`).toISOString();
                    return (
                      <button
                        key={time}
                        className={selectedSlot === isoDateTime ? "selected" : ""}
                        onClick={() => {
                          setSelectedDoctor(doctor.doctorId);
                          setSelectedSlot(isoDateTime);
                          setDoctor(doctor.doctorName)
                        }}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              ))
              }
             
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Section */}
      {selectedSlot && (
        <div className="book-appointment-section">
          <h3>Selected Doctor: {doctor}</h3>
          <h3>Selected Slot: {new Date(selectedSlot).toISOString().replace("T", " ").slice(0, 16)}</h3>


          <button onClick={handleBookAppointment}>Book Appointment</button>
        </div>
      )}

      {/* Display status message */}
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default BookAppointment;
