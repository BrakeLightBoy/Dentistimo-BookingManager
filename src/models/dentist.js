const mongoose = require('mongoose');


const dentistSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique : true
    },
    password: {
    type: String,
    required: true
    },
    lunch_time: {
        type: String,
        default : "12:00"
    },
    fika_time: {
        type: String,
        default : "16:00"
    },
    days_off: {
        type: [Date],
        default : null
    },
    works_at: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Clinic",
        required: true
    }
});

const Dentist = mongoose.model('Dentist', dentistSchema);

module.exports = Dentist;
