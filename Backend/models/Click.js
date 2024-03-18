const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
    UserData: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },

    device_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Click', ClickSchema);
