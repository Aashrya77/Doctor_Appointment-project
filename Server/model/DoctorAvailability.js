const mongoose = require("mongoose");

const DoctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  availableSlots: [
    {
      date: { type: String, required: true }, 
      timeSlots: [{ type: String, required: true }], 
    },
  ],
});

module.exports = mongoose.model("DoctorAvailability", DoctorAvailabilitySchema);
