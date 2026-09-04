const createCustomerRouter = require('./factories/createCustomerRouter');
const CustomerOcha = require('../models/customer.ocha.model');

module.exports = createCustomerRouter(CustomerOcha, {
    waitlistMessage: `You've been added to the waitlist at Ocha Thai Kitchen and Bar, we will notify you when a table is ready.`,
    notifyMessage: `We're ready for you at Ocha Thai Kitchen and Bar, please reply "1" to confirm or "6" to cancel`,
});
