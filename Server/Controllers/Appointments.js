const Appointment = require("../model/Appointment");
const User = require("../model/User");
const DoctorAvailability = require("../model/DoctorAvailability");
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slot } = req.body;
    const patientId = req.user._id;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "Doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    const dateObj = new Date(slot);
    const date = dateObj.toISOString().split("T")[0]; // Extract YYYY-MM-DD

    let hours = dateObj.getUTCHours();
    let minutes = dateObj.getUTCMinutes();
    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const time = `${hours}:${minutes}`;

    const availability = await DoctorAvailability.findOne({ doctor: doctorId });
    const isSlotAvailable = availability?.availableSlots.some((available) => {
      return available.date === date && available.timeSlots.includes(time);
    });

    if (!isSlotAvailable) {
      return res.status(400).json({ msg: "Selected slot is not available" });
    }

    const appointment = new Appointment({
      doctorId,
      patientId,
      slot: new Date(slot),
      status: "pending",
    });

    await appointment.save();
    return res
      .status(201)
      .json({ msg: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ msg: "Error booking appointment", error });
  }
};

const getAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "Doctor") {
      filter = { doctorId: req.user._id };
    } else {
      filter = { patientId: req.user._id };
    }

    const statusOrder = {
      pending: 1,
      approved: 2,
      rejected: 3,
      cancelled: 4,
    };

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "name email")
      .populate("patientId", "name email");

    appointments.sort((a, b) => {
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching appointments", error });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId).populate(
      "doctorId patientId",
      "name email"
    );
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    return res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching appointment", error });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }
    if (appointment.patientId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "You are not authorized to cancel this appointment" });
    }
    if (appointment.status == "cancelled" || appointment.status == "rejected") {
      return res
        .status(400)
        .json({ msg: "Appointment already cancelled/rejected" });
    }
    appointment.status = "cancelled";
    await appointment.save();
    return res
      .status(200)
      .json({ msg: "Appointment cancelled successfully", appointment });
  } catch (error) {
    res.status(500).json({ msg: "Error cancelling appointment", error });
  }
};

const approveRejectAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized action" });
    }

    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ msg: "Invalid status" });
    }

    appointment.status = status;
    await appointment.save();

    if (status === "approved") {
      if (!appointment.slot) {
        return res.status(400).json({ msg: "Invalid appointment slot data" });
      }

      const slotDate = new Date(appointment.slot).toISOString().split("T")[0]; // Extracts YYYY-MM-DD
      const slotTime = new Date(appointment.slot)
        .toISOString()
        .split("T")[1]
        .substring(0, 5); // Extracts HH:MM

      const doctorAvailability = await DoctorAvailability.findOne({
        doctor: appointment.doctorId,
      });

      if (!doctorAvailability) {
        return res.status(404).json({ msg: "Doctor's availability not found" });
      }

      const dateIndex = doctorAvailability.availableSlots.findIndex(
        (slot) => slot.date === slotDate
      );

      if (dateIndex !== -1) {
        // Removes the specific time slot from the date
        doctorAvailability.availableSlots[dateIndex].timeSlots =
          doctorAvailability.availableSlots[dateIndex].timeSlots.filter(
            (t) => t !== slotTime
          );

        // If no more time slots remain for that date, removes the date entry entirely
        if (
          doctorAvailability.availableSlots[dateIndex].timeSlots.length === 0
        ) {
          doctorAvailability.availableSlots.splice(dateIndex, 1);
        }

        await doctorAvailability.save();
      } else {
        console.log("No matching date found in availableSlots.");
      }
    }

    return res
      .status(200)
      .json({ msg: `Appointment ${status} successfully`, appointment });
  } catch (error) {
    console.error("Error approving/rejecting appointment:", error);
    res.status(500).json({ msg: "Internal server error", error });
  }
};

module.exports = {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  approveRejectAppointment,
  getAppointment,
};
