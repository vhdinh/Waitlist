const nodemailer = require('nodemailer');
const fns = require('date-fns');

const timeZone = 'America/Los_Angeles';
const locale = 'en-US';

const mailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.VU_EMAIL,
        pass: process.env.VU_EMAIL_APP_PW
    }
});

// Builds the booking CRUD router shared by every restaurant. The only
// per-restaurant differences were the Mongoose model, the notification
// email's subject/recipient/label, and the "See Calendar" link's URL
// segment - everything else was copy-pasted identically across
// booking.brick.js / booking.kuma.js / booking.eight.js.
function createBookingRouter(BookingModel, {
    restaurantLabel,
    emailSubject,
    notifyEmail,
    uiPathSegment,
    sendEmailNotification = true,
}) {
    const router = require('express').Router();

    router.route('/').get((req, res) => {
        BookingModel.find()
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/getMonth/:startOfMonth/:endOfMonth').get((req, res) => {
        const filters = {
            start: {
                $gt: Number(req.params.startOfMonth),
            },
            end: {
                $lt: Number(req.params.endOfMonth),
            },
            deleted: false
        };
        BookingModel.find(filters)
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/getDay/:startOfDay/:endOfDay/:isAdmin').get((req, res) => {
        const isAdmin = req.params.isAdmin === 'true';
        const filters = {
            start: {
                $gt: Number(req.params.startOfDay),
            },
            end: {
                $lt: Number(req.params.endOfDay),
            },
        };
        if (!isAdmin) {
            filters.deleted = false;
        }
        BookingModel.find(filters)
            .then(c => res.json(c))
            .catch(err => res.status(400).json('Error: ' + err));
    });

    router.route('/add').post((req, res) => {
        const newBooking = new BookingModel({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            partySize: req.body.partySize,
            notified: false,
            msg: '',
            deleted: false,
            start: req.body.start,
            end: req.body.end,
            note: req.body.note
        });
        newBooking.save()
            .then(() => {
                if (sendEmailNotification) {
                    const s = new Date(req.body.start).toLocaleString(locale, { timeZone, hour12: true }).replace(',', '');
                    const sDayUnix = new Date(fns.startOfDay(req.body.start)).getTime();
                    const e = new Date(req.body.end).toLocaleString(locale, { timeZone, hour12: true }).replace(',', '');
                    const mailDetails = {
                        from: process.env.VU_EMAIL,
                        to: notifyEmail,
                        subject: emailSubject,
                        html: "<div>" +
                            "<p>" + restaurantLabel + "</p>" +
                            "New Reservation has been added to the calendar:" +
                            "<p>Name: " + req.body.name + "</p>" +
                            "<p>Phone: " + req.body.phoneNumber + "</p>" +
                            "<p>Party Size: " + req.body.partySize + "</p>" +
                            "<p>Start Time: " + s + " (" + req.body.startDay + ")</p>" +
                            "<p>End Time: " + e + " (" + req.body.startDay + ")</p>" +
                            "<p>Note: " + req.body.note + "</p>" +
                            "<p><a href='" + process.env.UI_URL + "/" + uiPathSegment + "/reservations/" + sDayUnix + "'>See Calendar</a></p>" +
                            "</div>"
                    };
                    mailTransporter.sendMail(mailDetails, function (err) {
                        if (err) {
                            console.log('Error sending reservation email', err);
                        }
                    });
                }
                res.json(`you has been added to the reservation`);
            })
            .catch(err => res.status(400).json('error-saving-user: ' + err));
    });

    router.route('/delete/:id').post((req, res) => {
        BookingModel.findByIdAndUpdate(req.params.id, { deleted: req.body.delete || false })
            .then(() => res.json(`${req.params.id} deleted`))
            .catch((e) => res.json(`${e}`));
    });

    router.route('/update/:id').post((req, res) => {
        BookingModel.findByIdAndUpdate(req.params.id, req.body)
            .then(() => res.json(`${req.params.id} updated`))
            .catch((e) => res.json(`${e}`));
    });

    return router;
}

module.exports = createBookingRouter;
