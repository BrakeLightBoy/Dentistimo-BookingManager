const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    issuance: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    },
    dentist_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Dentist",
        required: true
    },
    request_id: {
        type: String,
        required: true
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
