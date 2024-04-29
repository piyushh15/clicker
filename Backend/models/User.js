const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    gateways: {
        type: [String], // Array of strings to store gateway IDs
        default: [] 
    },
});

module.exports = mongoose.model('User', UserSchema);
