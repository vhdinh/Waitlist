const mongoose = require('mongoose');

// connect to brick db
const eightDb = require("../connectDbs")('1988', process.env.EIGHT_MONGODB_URL);

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    phoneNumber: {
        type: String,
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

// Speeds up the /getMonth and /getDay range queries, which previously had
// no index to use and fell back to a full collection scan.
bookingSchema.index({ start: 1, end: 1, deleted: 1 });

const BookingEight = eightDb.model('Booking', bookingSchema);

module.exports = BookingEight;