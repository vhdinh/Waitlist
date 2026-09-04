const createCustomerRouter = require('./factories/createCustomerRouter');
const CustomerEight = require('../models/customer.eight.model');

module.exports = createCustomerRouter(CustomerEight, {
    waitlistMessage: `You've been added to the waitlist at 1988 Lounge + Bar, we will notify you when a table is ready.`,
    notifyMessage: `We're ready for you at 1988 Lounge + Bar, please reply "1" to confirm or "6" to cancel`,
});
