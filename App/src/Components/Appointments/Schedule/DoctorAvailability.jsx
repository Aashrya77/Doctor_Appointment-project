import { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorAvailability.css";

const DoctorAvailability = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState('')

  const addTimeSlot = () => {
    if (date && timeSlot) {
      setAvailableSlots([...availableSlots, { date, time: timeSlot }]);
      setTimeSlot("");
    }
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const submitAvailability = async () => {
    try {
      const token = localStorage.getItem("token");
      const formattedSlots = availableSlots.reduce((acc, slot) => {
        let existing = acc.find((item) => item.date === slot.date);
        if (existing) {
          existing.timeSlots.push(slot.time);
        } else {
          acc.push({ date: slot.date, timeSlots: [slot.time] });
        }
        return acc;
      }, []);
  
      await axios.post(
        "https://doctor-appointment-backend-tim3.onrender.com/api/v1/availability",
        { availableSlots: formattedSlots },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
   
      setMessage("Availability set succussfully!")
      setAvailableSlots([]);
    } catch (error) {
      console.error("Error setting availability", error);
      alert(error.response?.data?.msg || "An error occurred");
    }
  };

    useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
  
      return () => clearTimeout(timer); // Cleanup on unmount or new message
    }
  }, [message]);

  return (
    <div className="availability-container">
      <h2 className="availability-title">Set Availability</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="availability-input"
      />
      <input
        type="time"
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
        className="availability-input"
      />
      <button onClick={addTimeSlot} className="availability-button">
        Add Time Slot
      </button>
      <div className="availability-card">
        <div className="availability-content">
          {availableSlots.map((slot, index) => (
            <p key={index} className="availability-slot">
              {slot.date} - {convertTo12HourFormat(slot.time)}
            </p>
          ))}
        </div>
      </div>
     <button
  className="availability-button submit"
  onClick={submitAvailability}
  disabled={availableSlots.length === 0} 
>
  Submit Availability
</button>

        Submit Availability
      </button>
       {message && <p className="availability-message">{message}</p>}
    </div>
  );
};

export default DoctorAvailability;
