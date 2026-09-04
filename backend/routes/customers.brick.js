const createCustomerRouter = require('./factories/createCustomerRouter');
let CustomerBrick = require('../models/customer.brick.model');
let CustomerKuma = require('../models/customer.kuma.model');
let Customer1988 = require('../models/customer.eight.model');
let CustomerOcha = require('../models/customer.ocha.model');
const socket = require('../server');
const fns = require('date-fns')

const router = createCustomerRouter(CustomerBrick, {
    waitlistMessage: `You've been added to the waitlist at The Brick, we will notify you when a table is ready.`,
    notifyMessage: `We're ready for you at the Brick, please reply "1" to confirm or "6" to cancel`,
});

// Single Twilio webhook shared by all 4 restaurants (one Twilio phone
// number for the whole system), so this handler looks the customer up
// across every restaurant's collection to figure out who actually replied.
router.route('/reply').post(async (req, res) => {
    const msgFrom = req.body.From;
    const msgBody = req.body.Body;
    console.log('webhook /reply received, msg:', msgBody);

    const todayFilter = {
        phoneNumber: msgFrom,
        deleted: false,
        seated: false,
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        }
    };

    let brickCustomer, kumaCustomer, eightCustomer, ochaCustomer;
    try {
        // Run concurrently: sequential awaits meant one slow/dead DB
        // connection would serialize a 10s buffering timeout in front of
        // every other lookup (up to ~40s worst case) before this handler
        // could even respond to Twilio.
        [brickCustomer, kumaCustomer, eightCustomer, ochaCustomer] = await Promise.all([
            CustomerBrick.find(todayFilter),
            CustomerKuma.find(todayFilter),
            Customer1988.find(todayFilter),
            CustomerOcha.find(todayFilter),
        ]);
    } catch (err) {
        console.error('error looking up customer for /reply:', err);
        return res.send(`
            <Response>
                <Message>
                    Sorry, we're having trouble processing your reply right now. Please call the restaurant directly.
                </Message>
            </Response>
        `);
    }

    if (brickCustomer.length > 0) {
        CustomerBrick.findOneAndUpdate(
            {
                phoneNumber: msgFrom,
                deleted: false,
                createdAt: {
                    $gte: fns.startOfDay(new Date()),
                },
            }, { msg: msgBody, msgAt: new Date() }).then(() => {
                socket.ioObject.sockets.emit('brick_user_replied', {
                    message: 'reload'
                });
                let rspMsg = '';
                if (msgBody == '1') {
                    console.log('BRICK notification: user accepted ', msgBody);
                    rspMsg = `Thank you, please check in to be seated promptly.`
                } else if (msgBody == '6') {
                    console.log('BRICK notification: user rejected ', msgBody);
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
            .catch((err) => {
                console.error('error updating brick customer for /reply:', err);
                return res.send(`
                    <Response>
                        <Message>
                            Sorry, we're having trouble processing your reply right now. Please call the restaurant directly.
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
            }, { msg: msgBody, msgAt: new Date() }).then(() => {
                socket.ioObject.sockets.emit('kuma_user_replied', {
                    message: 'reload'
                });
                let rspMsg = '';
                if (msgBody == '1') {
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
            .catch((err) => {
                console.error('error updating kuma customer for /reply:', err);
                return res.send(`
                    <Response>
                        <Message>
                            Sorry, we're having trouble processing your reply right now. Please call the restaurant directly.
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
            }, { msg: msgBody, msgAt: new Date() }).then(() => {
                socket.ioObject.sockets.emit('eight_user_replied', {
                    message: 'reload'
                });
                let rspMsg = '';
                if (msgBody == '1') {
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
            .catch((err) => {
                console.error('error updating eight customer for /reply:', err);
                return res.send(`
                    <Response>
                        <Message>
                            Sorry, we're having trouble processing your reply right now. Please call the restaurant directly.
                        </Message>
                    </Response>
                `);
            })
    } else {
        CustomerOcha.findOneAndUpdate(
            {
                phoneNumber: msgFrom,
                deleted: false,
                createdAt: {
                    $gte: fns.startOfDay(new Date()),
                },
            }, { msg: msgBody, msgAt: new Date() }).then(() => {
                socket.ioObject.sockets.emit('ocha_user_replied', {
                    message: 'reload'
                });
                let rspMsg = '';
                if (msgBody == '1') {
                    console.log('OCHA notification: user accepted ', msgBody);
                    rspMsg = `Thank you, please check in to be seated promptly.`
                } else if (msgBody == '6') {
                    console.log('OCHA notification: user rejected ', msgBody);
                    rspMsg = `Thank you, you have been removed from the Ocha's waitlist.`
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
            .catch((err) => {
                console.error('error updating ocha customer for /reply:', err);
                return res.send(`
                    <Response>
                        <Message>
                            Sorry, we're having trouble processing your reply right now. Please call the restaurant directly.
                        </Message>
                    </Response>
                `);
            })
    }
})

module.exports = router;
