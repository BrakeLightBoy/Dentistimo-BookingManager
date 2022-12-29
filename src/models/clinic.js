const mongoose = require('mongoose');


const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    coordinate: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    opening_hours: {
        monday: {
            type: String,
            required: true
        },
        tuesday: {
            type: String,
            required: true
        },
        wednesday: {
            type: String,
            required: true
        },
        thursday: {
            type: String,
            required: true
        },
        friday: {
            type: String,
            required: true
        }
    }
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
