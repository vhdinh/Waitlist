const router = require('express').Router();
let CustomerBrick = require('../models/customer.brick.model');
let CustomerKuma = require('../models/customer.kuma.model');
let Customer1988 = require('../models/customer.eight.model');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const socket = require('../server');
const fns = require('date-fns')

router.route('/').get((req, res) => {
    CustomerBrick.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/logs/:start/:end').get((req, res) => {
    const start = new Date(parseInt(req.params.start));
    let end = new Date(parseInt(req.params.end));
    CustomerBrick.find({
        createdAt: {
            $gt: fns.startOfDay(start),
            $lt: fns.endOfDay(end),
        },
    })
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/getCurrent').get((req, res) => {
    CustomerBrick.find({
        createdAt: {
            $gte: fns.startOfDay(new Date()),
        },
        deleted: false
    })
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log('route /add:', req.body);
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const partySize = req.body.partySize;

    const newCustomer = new CustomerBrick({
        name: name,
        phoneNumber: phoneNumber,
        partySize: partySize,
        notified: false,
        msg: '',
        deleted: false,
    });

    newCustomer.save()
        .then((r) => {
            console.log('user-saved:', r);
            client.messages
                .create({
                    body: `You've been added to the waitlist at The Brick, we will notify you when a table is ready.`,
                    to: req.body.phoneNumber, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then((message) => {
                    console.log('user-added:', message);
                    CustomerBrick.findByIdAndUpdate(r._id, { phoneNumber: message.to }).then(() => {
                        socket.ioObject.sockets.emit('user_replied', {
                            message: 'reload'
                        });
                        res.json(`${name} has been added to the waitlist`)
                    })
                })
                .catch((e) => {
                    CustomerBrick.findByIdAndRemove(r._id).then((r) => res.status(400).json('error-invalid-phone: ' + e));
                });
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
});

router.route('/:id/notify').post((req, res) => {
    console.log('route /notify:', req.body);
    CustomerBrick.findById(req.body.id).then((c) => {
        client.messages
            .create({
                // body: `We're ready for you at the Brick, please check in with the host or call us at 425-264-5220`,
                body: `We're ready for you at the Brick, please reply "1" to confirm or "6" to cancel`,
                to: c.phoneNumber, // Text this number
                from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
            })
            .then((message) => {
                console.log('notify-success: ', message);
                CustomerBrick.findByIdAndUpdate(req.body.id, { notified: true, notifiedAt: new Date() })
                    .then((r) => res.json(`${req.body.id} notified`))
                    .catch((e) => res.status(400).json(`error-update-notified: ${req.body.id} notified updated failed`));
            }).catch((e) => res.status(400).json('error-notifying-user: ' + e));
    });
});
router.route('/:id/delete').post((req, res) => {
    console.log('delete:', req.body);
    // NO LONGER DELETING, WANT TO TRACK ALL HISTORY OF WAIT LIST
    CustomerBrick.findByIdAndUpdate(req.body.id, {deleted: true})
        .then((r) => res.json(`${req.body.id} deleted`))
        .catch((e) => res.status(400).json('error-deleting-user: ' + e))
    // NO LONGER DELETING, WANT TO TRACK ALL HISTORY OF WAITLIST
    // Customer.findByIdAndRemove(req.body.id)
    //     .then((r) => res.json(`${req.body.id} deleted`))
    //     .catch((e) => res.status(400).json('error-deleting-user: ' + e))
});

router.route('/reply').post(async (req, res) => {
    const msgFrom = req.body.From;
    const msgBody = req.body.Body;
    const num = msgFrom.substring(1);
    console.log(`Brick webhook user replied from: ${msgFrom}, number: ${num}, msg: ${msgBody}`);
    const brickCustomer = await CustomerBrick.find({
        phoneNumber: msgFrom,
        deleted: false,
        createdAt: {
            $gte: fns.startOfDay(new Date()),
        }});
    const kumaCustomer = await CustomerKuma.find({
        phoneNumber: msgFrom,
        deleted: false,
        createdAt: {
            $gte: fns.startOfDay(new Date()),
        }});
    const eightCustomer = await Customer1988.find({
        phoneNumber: msgFrom,
        deleted: false,
        createdAt: {
            $gte: fns.startOfDay(new Date()),
        }});
    console.log('---BRICK---', brickCustomer);
    console.log('---KUMA---', kumaCustomer);
    console.log('---EIGHT---', eightCustomer);
    if (brickCustomer.length > 0) {
        CustomerBrick.findOneAndUpdate(
            {
                phoneNumber: msgFrom,
                deleted: false,
                createdAt: {
                    $gte: fns.startOfDay(new Date()),
                },
            },{ msg: msgBody, msgAt: new Date() }).then(() => {
            socket.ioObject.sockets.emit('user_replied', {
                message: 'reload'
            });
            let rspMsg = '';
            if(msgBody == '1') {
                console.log('notification: user accepted ', msgBody);
                rspMsg = `Thank you, please check in to be seated promptly.`
            } else if (msgBody == '6') {
                console.log('notification: user rejected ', msgBody);
                rspMsg = `Thank you, you have been removed from the Brick's waitlist.`
            }
            // // if we want to respond to user with another msg
            return res.send(`
                    <Response>
                        <Message>
                            ${rspMsg}
                        </Message>
                    </Response>
                `);
        })
    } else if (kumaCustomer.length > 0) {
        CustomerKuma.findOneAndUpdate(
            {
                phoneNumber: msgFrom,
                deleted: false,
                createdAt: {
                    $gte: fns.startOfDay(new Date()),
                },
            },{ msg: msgBody, msgAt: new Date() }).then(() => {
            socket.ioObject.sockets.emit('user_replied', {
                message: 'reload'
            });
            let rspMsg = '';
            if(msgBody == '1') {
                console.log('KUMA notification: user accepted ', msgBody);
                rspMsg = `Thank you, please check in to be seated promptly.`
            } else if (msgBody == '6') {
                console.log('KUMA notification: user rejected ', msgBody);
                rspMsg = `Thank you, you have been removed from the Kuma's waitlist.`
            }
            // // if we want to respond to user with another msg
            return res.send(`
                    <Response>
                        <Message>
                            ${rspMsg}
                        </Message>
                    </Response>
                `);
        })
    } else if (eightCustomer.length > 0) {
        Customer1988.findOneAndUpdate(
            {
                phoneNumber: msgFrom,
                deleted: false,
                createdAt: {
                    $gte: fns.startOfDay(new Date()),
                },
            },{ msg: msgBody, msgAt: new Date() }).then(() => {
            socket.ioObject.sockets.emit('user_replied', {
                message: 'reload'
            });
            let rspMsg = '';
            if(msgBody == '1') {
                console.log('EIGHT notification: user accepted ', msgBody);
                rspMsg = `Thank you, please check in to be seated promptly.`
            } else if (msgBody == '6') {
                console.log('EIGHT notification: user rejected ', msgBody);
                rspMsg = `Thank you, you have been removed from the 1988's waitlist.`
            }
            // // if we want to respond to user with another msg
            return res.send(`
                    <Response>
                        <Message>
                            ${rspMsg}
                        </Message>
                    </Response>
                `);
        })
    }
})

module.exports = router;