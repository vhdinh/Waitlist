const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    notified: {
        type: Boolean,
        required: true,
    },
    startTime: {
        type: Number,
        required:true
    },
    endTime: {
        type: Number,
        required:true
    },
    msg: { // 1: accept 6: decline
        type: String,
        required: false,
    },
    partySize: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;