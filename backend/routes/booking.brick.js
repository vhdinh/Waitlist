const nodemailer = require("nodemailer");
const router = require('express').Router();
let BookingBrick = require('../models/booking.brick.model');
const fns = require('date-fns')
const timeZone = 'America/Los_Angeles';
const locale = 'en-US';
const dateFormat = 'eeee';

let mailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.VU_EMAIL,
        pass: process.env.VU_EMAIL_APP_PW
    }
});

router.route('/').get((req, res) => {
    BookingBrick.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getMonth/:startOfMonth/:endOfMonth').get((req, res) => {
    console.log('---route--- /getMonth/', req.params.startOfMonth, req.params.endOfMonth);
    let filters = {
        start: {
            $gt: req.params.startOfMonth,
        },
        end: {
            $lt: req.params.endOfMonth,
        },
        deleted: false
    };
    BookingBrick.find(filters)
        .then(c => {
            console.log('___FOUND_BOOKINGS_FOR_MONTH___', c);
            return res.json(c)
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/getDay/:startOfDay/:endOfDay/:isAdmin').get((req, res) => {
    console.log('---route--- /getDay/', req.params.startOfDay, req.params.endOfDay, req.params.isAdmin);
    const isAdmin = req.params.isAdmin === 'true' ? true : false;
    let filters = {
        start: {
            $gt: Number(req.params.startOfDay),
        },
        end: {
            $lt: Number(req.params.endOfDay),
        },
    };
    if (!isAdmin) {
        filters.deleted = false;
    };
    BookingBrick.find(filters)
        .then(c => {
            console.log('FOUND BOOKINGS FOR DAY:', c);
            return res.json(c);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log('---route--- /add')
    const newBooking = new BookingBrick({
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
        .then((r) => {
            console.log('booking-saved:', r);
            let s = new Date(req.body.start).toLocaleString(locale,{timeZone: timeZone, hour12:true}).replace(',','');
            let sDayUnix = new Date(fns.startOfDay(req.body.start)).getTime();
            let e = new Date(req.body.end).toLocaleString(locale,{timeZone: timeZone, hour12:true}).replace(',','');
            let mailDetails = {
                from: process.env.VU_EMAIL,
                to: process.env.BRICK_EMAIL,
                subject: 'New Reservation Brick Kitchen and Lounge',
                html: "<div>" +
                    "<p>" + "Kuma Kitchen + Bar" + "</p>" +
                    "New Reservation has been added to the calendar:" +
                    "<p>Name: " + req.body.name + "</p>" +
                    "<p>Phone: " + req.body.phoneNumber + "</p>" +
                    "<p>Party Size: " + req.body.partySize + "</p>" +
                    "<p>Start Time: " + s + " ("  + req.body.startDay + ")</p>" +
                    "<p>End Time: " + e + " ("  + req.body.startDay + ")</p>" +
                    "<p>Note: " + req.body.note + "</p>" +
                    "<p><a href='" + process.env.UI_URL + "/brick/reservations/" +  sDayUnix + "'>See Calendar</a></p>" +
                    "</div>"
            };
            console.log('----- GOING TO SEND EMAIL -----', mailDetails);
            // EMAIL NOTIFICATION FOR NEW RESERVATION
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log('Error Occurs', err);
                } else {
                    console.log('Email sent successfully');
                }
            });
            res.json(`you has been added to the reservation`);
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
});

router.route('/delete/:id').post((req, res) => {
    console.log('---route--- /delete/', req.params.id, req.body.delete);
    BookingBrick.findByIdAndUpdate(req.params.id, { deleted: req.body.delete || false })
        .then((r) => res.json(`${req.params.id} deleted`))
        .catch((e) => res.json(`${e}`));
})

router.route('/update/:id').post((req, res) => {
    console.log(`---route--- /update/`, req.params.id, req.body);
    BookingBrick.findByIdAndUpdate(req.params.id, req.body).then((r) => res.json(`${req.params.id} updated`))
        .catch((e) => {
            console.log('---route--- /update/ FAILED', e);
            return res.json(`${e}`)
        });

});


module.exports = router;