const DoctorAvailability = require("../model/DoctorAvailability");



const setAvailability = async (req, res) => {
  try {
    const { availableSlots } = req.body;
    const doctorId = req.user._id;

    if (req.user.role !== "Doctor") {
      return res.status(403).json({ msg: "Only doctors can set availability" });
    }

    let availability = await DoctorAvailability.findOne({ doctor: doctorId });

    if (!availability) {
      availability = new DoctorAvailability({
        doctor: doctorId,
        availableSlots: [],
      });
    }

    availableSlots.forEach((newSlot) => {
      const existingSlot = availability.availableSlots.find(
        (slot) => slot.date === newSlot.date
      );

      if (existingSlot) {
        newSlot.timeSlots.forEach((time) => {
          if (!existingSlot.timeSlots.includes(time)) {
            existingSlot.timeSlots.push(time);
          }
        });
      } else {
        availability.availableSlots.push({
          date: newSlot.date,
          timeSlots: newSlot.timeSlots,
        });
      }
    });

    await availability.save();
    res.status(201).json({ msg: "Availability set successfully", availability });
  } catch (error) {
    res.status(500).json({ msg: "Error setting availability", error });
  }
};



const getAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const availability = await DoctorAvailability.findOne({ doctor: doctorId });

    if (!availability) {
      return res.status(404).json({ msg: "No availability found for this doctor" });
    }

    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching availability", error });
  }
};



const availableSlots = async (req, res) => {
  try {
    const doctorAvailability = await DoctorAvailability.find().populate('doctor', 'name email')
      


    if (!doctorAvailability || doctorAvailability.length === 0) {
      return res.status(404).json({ msg: 'No doctor availability found' });
    }

    const doctorSlots = doctorAvailability.map(availability => ({
      doctorId: availability.doctor._id, 
      doctorName: availability.doctor.name,
      availableSlots: availability.availableSlots,
    }));

    res.json({ doctorSlots });
  } catch (error) {
    res.status(500).json({
      msg: 'Error fetching availability',
      error: error.message,
    });
  }
}
 
module.exports = { setAvailability, getAvailability, availableSlots };
