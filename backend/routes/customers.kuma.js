const createCustomerRouter = require('./factories/createCustomerRouter');
const CustomerKuma = require('../models/customer.kuma.model');

module.exports = createCustomerRouter(CustomerKuma, {
    waitlistMessage: `You've been added to the waitlist at Kuma Kitchen + Bar, we will notify you when a table is ready.`,
    notifyMessage: `We're ready for you at Kuma Kitchen + Bar, please reply "1" to confirm or "6" to cancel`,
});
