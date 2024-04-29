const mongoose = require('mongoose');
const clickSchema = new mongoose.Schema({
    gateway_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    clicker_id: {
        type: String,
        required: true
    }
});
const Click = mongoose.model('Click', clickSchema);
module.exports = Click;
