const nodemailer = require("nodemailer");
const router = require('express').Router();
let Booking = require('../models/booking.model');
const fns = require('date-fns')

let mailTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.VU_EMAIL,
        pass: process.env.VU_EMAIL_APP_PW
    }
});

router.route('/').get((req, res) => {
    Booking.find()
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
    Booking.find(filters)
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
    Booking.find(filters)
        .then(c => {
            console.log('FOUND BOOKINGS FOR DAY:', c);
            return res.json(c);
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log('---route--- /add')
    const newBooking = new Booking({
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
            let s = new Date(req.body.start).toLocaleString('en-US',{timeZone:'America/Los_Angeles', hour12:true}).replace(',','')
            let sDay = fns.format(new Date(req.body.start), 'eeee');
            let e = new Date(req.body.end).toLocaleString('en-US',{timeZone:'America/Los_Angeles', hour12:true}).replace(',','')
            let mailDetails = {
                from: process.env.VU_EMAIL,
                to: process.env.BRICK_EMAIL,
                subject: 'New Reservation',
                html: "<div>" +
                    "New Reservation has been added to the calendar:" +
                    "<p>Name: " + req.body.name + "</p>" +
                    "<p>Phone: " + req.body.phoneNumber + "</p>" +
                    "<p>Party Size: " + req.body.partySize + "</p>" +
                    "<p>Start Time: " + s + " ("  + sDay + ")</p>" +
                    "<p>End Time: " + e + " ("  + sDay + ")</p>" +
                    "<p>Note: " + req.body.note + "</p>" +
                    "<p><a href='" + process.env.UI_URL + "/reservations/" + req.body.start + "'>See Calendar</a></p>" +
                    "</div>"
            };
            console.log('----- GOING TO SEND EMAIL -----', mailDetails);

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
    Booking.findByIdAndUpdate(req.params.id, { deleted: req.body.delete || false })
        .then((r) => res.json(`${req.params.id} deleted`))
        .catch((e) => res.json(`${e}`));
})

router.route('/update/:id').post((req, res) => {
    console.log(`---route--- /update/`, req.params.id, req.body);
    Booking.findByIdAndUpdate(req.params.id, req.body).then((r) => res.json(`${req.params.id} updated`))
        .catch((e) => {
            console.log('---route--- /update/ FAILED', e);
            return res.json(`${e}`)
        });

});


module.exports = router;