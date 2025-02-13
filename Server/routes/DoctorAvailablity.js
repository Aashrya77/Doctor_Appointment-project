const express = require("express");
const { setAvailability, getAvailability, availableSlots } = require("../Controllers/DoctorAvailablity");
const {authentication, authorizeRole} = require("../middleware/auth");

const router = express.Router();

router.post("/availability", authentication,authorizeRole(["Doctor"]), setAvailability); 
router.get("/availability/:doctorId", getAvailability); 
router.get('/available-slots', authentication, availableSlots)

module.exports = router;
