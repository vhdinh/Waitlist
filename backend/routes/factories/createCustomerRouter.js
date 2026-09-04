const fns = require('date-fns');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const socket = require('../../server');

// Builds the waitlist CRUD router shared by every restaurant. Each
// restaurant's customers.*.js differed only in the model and the SMS copy -
// the read/write logic itself was copy-pasted identically. Restaurant-
// specific extras (e.g. Brick's combined /reply webhook) are added by the
// caller on top of the router this returns.
function createCustomerRouter(CustomerModel, {
    waitlistMessage,
    notifyMessage,
}) {
    const router = require('express').Router();

    router.route('/').get((req, res) => {
        CustomerModel.find()
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/logs/:start/:end').get((req, res) => {
        const start = new Date(parseInt(req.params.start));
        const end = new Date(parseInt(req.params.end));
        CustomerModel.find({
            createdAt: {
                $gt: fns.startOfDay(start),
                $lt: fns.endOfDay(end),
            },
        })
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/getCurrent').get((req, res) => {
        CustomerModel.find({
            createdAt: {
                $gte: fns.startOfDay(new Date()),
            },
        })
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/add').post((req, res) => {
        const { name, phoneNumber, partySize } = req.body;

        const newCustomer = new CustomerModel({
            name,
            phoneNumber,
            partySize,
            notified: false,
            msg: '',
            deleted: false,
        });

        newCustomer.save()
            .then((r) => {
                client.messages
                    .create({
                        body: waitlistMessage,
                        to: phoneNumber, // Text this number
                        from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                    })
                    .then((message) => {
                        CustomerModel.findByIdAndUpdate(r._id, { phoneNumber: message.to }).then(() => {
                            socket.ioObject.sockets.emit('user_replied', {
                                message: 'reload'
                            });
                            res.json(`${name} has been added to the waitlist`);
                        });
                    })
                    .catch((e) => {
                        CustomerModel.findByIdAndRemove(r._id).then(() => res.status(400).json('error-invalid-phone: ' + e));
                    });
            })
            .catch(err => res.status(400).json('error-saving-user: ' + err));
    });

    router.route('/:id/notify').post((req, res) => {
        CustomerModel.findById(req.body.id).then((c) => {
            client.messages
                .create({
                    body: notifyMessage,
                    to: c.phoneNumber, // Text this number
                    from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then(() => {
                    CustomerModel.findByIdAndUpdate(req.body.id, { notified: true, notifiedAt: new Date() })
                        .then(() => res.json(`${req.body.id} notified`))
                        .catch(() => res.status(400).json(`error-update-notified: ${req.body.id} notified updated failed`));
                }).catch((e) => res.status(400).json('error-notifying-user: ' + e));
        });
    });

    router.route('/:id/delete').post((req, res) => {
        // NO LONGER DELETING, WANT TO TRACK ALL HISTORY OF WAIT LIST
        CustomerModel.findByIdAndUpdate(req.body.id, { deleted: true })
            .then(() => res.json(`${req.body.id} deleted`))
            .catch((e) => res.status(400).json('error-deleting-user: ' + e));
    });

    router.route('/:id/seat').post((req, res) => {
        CustomerModel.findByIdAndUpdate(req.body.id, { seated: true })
            .then(() => res.json(`${req.body.id} seated`))
            .catch((e) => res.status(400).json('error-seating-user: ' + e));
    });

    return router;
}

module.exports = createCustomerRouter;
