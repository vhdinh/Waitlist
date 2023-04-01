const router = require('express').Router();
let Customer = require('../models/customer.model');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.route('/').get((req, res) => {
    Customer.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const partySize = req.body.partySize;

    const newCustomer = new Customer({name: name, phoneNumber: phoneNumber, partySize: partySize });

    newCustomer.save()
        .then((r) => {
            client.messages
                .create({
                    body: `You've been added to the waitlist at The Brick`,
                    to: req.body.phoneNumber, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then((message) => console.log(message.sid));
            return res.json('Customer added!')
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id/notify').post((req, res) => {
    Customer.findById(req.body.id).then((c) => {
        client.messages
            .create({
                body: `We're ready for you at the Brick, please check in with the host within the next 5 minutes`,
                to: c.phoneNumber, // Text this number
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => {
                Customer.findByIdAndRemove(req.body.id).then((r) => res.json(`${req.body.id} deleted`))
            });
    });
});
router.route('/:id/delete').post((req, res) => {
    Customer.findByIdAndRemove(req.body.id).then((r) => res.json(`${req.body.id} deleted`))
});

module.exports = router;