const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true,
        unique: true
    },
    personal_number: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 12
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
