const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    title: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    notified: {
        type: Boolean,
        required: true,
    },
    start: {
        type: Number,
        required:true
    },
    end: {
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
    deleted: {
        type: Boolean,
        required: false,
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