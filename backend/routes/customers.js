const router = require('express').Router();
let Customer = require('../models/customer.model');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const socket = require('../server');

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
            console.log('user-saved:', r);
            client.messages
                .create({
                    body: `You've been added to the waitlist at The Brick, We will notify you when a table is ready`,
                    to: req.body.phoneNumber, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then((message) => {
                    console.log('user-added:', message);
                    Customer.findByIdAndUpdate(r._id, { phoneNumber: message.to }).then(() =>
                        res.json(`${name} has been added to the waitlist`)
                    )
                })
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
                body: `We're ready for you at the Brick, please reply "1" to confirm or "6" to cancel`,
                to: c.phoneNumber, // Text this number
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => {
                console.log('notify-success: ', message);
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

router.route('/reply').post((req, res) => {
    console.log('----REPLY----', req.body);
    const msgFrom = req.body.From;
    const msgBody = req.body.Body;
    const num = msgFrom.substring(1);
    Customer.findOneAndUpdate({phoneNumber: num}, { msg: msgBody }).then(() => {
        socket.ioObject.sockets.emit('user_replied', {
            message: 'reload'
        });
        let rspMsg = '';
        if(msgBody == '1') {
            rspMsg = `Thank you, please check in to be seated promptly.`
        } else if (msgBody == '6') {
            rspMsg = `Thank you, you have been removed from the waitlist.`
        }
        // // if we want to respond to user with another msg
        res.send(`
                <Response>
                    <Message>
                        ${rspMsg}
                    </Message>
                </Response>
            `);

        res.json(`${msgFrom} has responded with ${msgBody}`)

            // TODO: hook up socket to send to UI
    })
})

module.exports = router;