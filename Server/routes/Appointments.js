const express = require('express')
const router = express.Router()
const {getAppointments, bookAppointment, cancelAppointment, approveRejectAppointment, getAppointment} = require('../Controllers/Appointments')
const {authentication, authorizeRole} = require('../middleware/auth')


router.route('/appointments').get(authentication,getAppointments).post(authentication,authorizeRole(["Patient"]),bookAppointment)
router.route('/cancel-appointment/:id').put(authentication,authorizeRole(["Patient"]),cancelAppointment)
router.route('/appointment-status/:id').put(authentication,authorizeRole(["Doctor"]),approveRejectAppointment)
router.route('/appointments/:id').get(authentication,getAppointment)

module.exports = router