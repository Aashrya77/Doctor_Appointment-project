const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide patient']
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide doctor'],
    },
    slot: {
        type: Date,
        required: [true, 'Please provide date'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
    },
}, {timestamps: true})

module.exports = mongoose.model('Appointment', AppointmentSchema)