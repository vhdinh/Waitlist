const mongoose = require('mongoose');

// connect to brick db
const brickDb = require("../connectDbs")('Brick', process.env.BRICK_MONGODB_URL);

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
    collation: 'brick'
});

const BookingBrick = brickDb.model('Booking', bookingSchema);

module.exports = BookingBrick;