const mongoose = require('mongoose');

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
    accepted: { // 1: accept 6: decline
        type: Boolean,
        required: true,
    },
    partySize: {
        type: Number,
        required: true,
    },
    seated: {
        type: Boolean,
        required: true,
    },
    abandoned: {
        type: Boolean,
        required: false,
    }
}, {
    timestamps: true,
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;