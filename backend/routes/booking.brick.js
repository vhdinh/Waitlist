const createBookingRouter = require('./factories/createBookingRouter');
const BookingBrick = require('../models/booking.brick.model');

module.exports = createBookingRouter(BookingBrick, {
    restaurantLabel: 'Brick Kitchen + Lounge',
    emailSubject: 'New Reservation Brick Kitchen and Lounge',
    notifyEmail: process.env.BRICK_EMAIL,
    uiPathSegment: 'brick',
    sendEmailNotification: true,
});
