const createBookingRouter = require('./factories/createBookingRouter');
const BookingEight = require('../models/booking.eight.model');

module.exports = createBookingRouter(BookingEight, {
    restaurantLabel: '1988 Lounge + Bar',
    emailSubject: 'New Reservation 1988 Lounge and Bar',
    notifyEmail: process.env.KUMA_EMAIL,
    uiPathSegment: 'eight',
    // Email sending was already disabled here (commented out) before this
    // file was deduplicated into the shared factory - preserved as-is.
    sendEmailNotification: false,
});
