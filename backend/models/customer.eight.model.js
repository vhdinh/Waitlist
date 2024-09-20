const mongoose = require('mongoose');

// connect to brick db
const eightEightDb = require("../connectDbs")('1988', process.env.EIGHT_MONGODB_URL);

const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
    notifiedAt: {
        type: Date,
    },
    msg: { // 1: accept 6: decline
        type: String,
        required: false,
    },
    msgAt: {
        type: Date,
    },
    partySize: {
        type: Number,
        required: true,
    },
    deleted: {
        type: Boolean,
        required: false,
    }
}, {
    timestamps: true,
});

const Customer1988 = eightEightDb.model('Customer', customerSchema);

module.exports = Customer1988;