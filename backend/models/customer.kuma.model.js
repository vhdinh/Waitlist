const mongoose = require('mongoose');

// connect to brick db
const kumaDb = require("../connectDbs")('Kuma', process.env.KUMA_MONGODB_URL);

const Schema = mongoose.Schema;

const customerSchema = new Schema({
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

const CustomerKuma = kumaDb.model('Customer', customerSchema);

module.exports = CustomerKuma;