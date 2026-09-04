const mongoose = require('mongoose');

// connect to kuma db
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
    seated: {
        type: Boolean,
        requred: false,
        default: false,
    },
    deleted: {
        type: Boolean,
        required: false,
    }
}, {
    timestamps: true,
});

// Speeds up the /reply webhook lookup (phoneNumber + deleted + createdAt)
// and the /logs, /getCurrent date-range queries, which previously had no
// index to use and fell back to a full collection scan.
customerSchema.index({ phoneNumber: 1, deleted: 1, createdAt: 1 });
customerSchema.index({ createdAt: 1 });

const CustomerKuma = kumaDb.model('Customer', customerSchema);

module.exports = CustomerKuma;