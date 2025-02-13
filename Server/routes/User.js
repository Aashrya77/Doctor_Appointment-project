const express = require('express')
const router = express.Router()
const { register, login, getUserProfile, getDoctors } = require('../Controllers/User')
const {authentication} = require('../middleware/auth')

router.route('/auth/register').post(register)
router.route('/auth/login').post(login)
router.route('/auth/profile').get(authentication, getUserProfile)
router.route('/auth/doctors').get( getDoctors)

module.exports = router