const router = require('express').Router();
let Customer = require('../models/customer.model');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.route('/').get((req, res) => {
    Customer.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log('add:', req.body);
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const partySize = req.body.partySize;

    const newCustomer = new Customer({name: name, phoneNumber: phoneNumber, partySize: partySize, notified: false });

    newCustomer.save()
        .then((r) => {
            console.log('new_user_added', r);
            client.messages
                .create({
                    body: `You've been added to the waitlist at The Brick`,
                    to: req.body.phoneNumber, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then((message) => res.json(`${name} has been added to the waitlist`))
                .catch((e) => {
                    Customer.findByIdAndRemove(r._id).then((r) => res.status(400).json('error-invalid-phone: ' + e));
                });
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
});

router.route('/:id/notify').post((req, res) => {
    console.log('notify:', req.body);
    Customer.findById(req.body.id).then((c) => {
        client.messages
            .create({
                // body: `We're ready for you at the Brick, please check in with the host or call us at 425-264-5220`,
                body: `We're ready for you at the Brick, please reply 1 to confirm or 6 to cancel`,
                to: c.phoneNumber, // Text this number
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => {
                Customer.findByIdAndUpdate(req.body.id, { notified: true })
                    .then((r) => res.json(`${req.body.id} notified`))
                    .catch((e) => res.status(400).json(`error-update-notified: ${req.body.id} notified updated failed`));
            }).catch((e) => res.status(400).json('error-notifying-user: ' + e));
    });
});
router.route('/:id/delete').post((req, res) => {
    console.log('delete:', req.body);
    Customer.findByIdAndRemove(req.body.id)
        .then((r) => res.json(`${req.body.id} deleted`))
        .catch((e) => res.status(400).json('error-deleting-user: ' + err))
});

module.exports = router;