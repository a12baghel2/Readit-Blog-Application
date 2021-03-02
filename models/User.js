// Imports
const mongoose = require('mongoose');

// User Schema to store the Data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
    },
    username : {
        type: String,
        required: true,
        max: 20,
        min: 6,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('User', userSchema);