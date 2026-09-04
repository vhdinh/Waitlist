const createBookingRouter = require('./factories/createBookingRouter');
const BookingKuma = require('../models/booking.kuma.model');

module.exports = createBookingRouter(BookingKuma, {
    restaurantLabel: 'Kuma Kitchen + Bar',
    emailSubject: 'New Reservation Kuma Kitchen and Bar',
    notifyEmail: process.env.KUMA_EMAIL,
    uiPathSegment: 'kuma',
    // Email sending was already disabled here (commented out) before this
    // file was deduplicated into the shared factory - preserved as-is.
    sendEmailNotification: false,
});
