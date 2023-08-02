const router = require('express').Router();
let Booking = require('../models/booking.model');

router.route('/').get((req, res) => {
    Booking.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getMonth/:month').get((req, res) => {
    const date = new Date(Number(req.params.month)), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 1);
    let filters = {
        startTime: {
            $gt: firstDay.getTime()
        },
        endTime: {
            $lt: lastDay.getTime()
        },
        deleted: false
    };
    Booking.find(filters)
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/getDay/:day/:isAdmin').get((req, res) => {
    const isAdmin = req.params.isAdmin === 'true' ? true : false;
    const start = new Date(parseInt(req.params.day)).setHours(0,0,0,0);
    const endTime = Number(req.params.day) + 86400000;
    let end = new Date(start);
    end.setHours(23,59,59,999);
    console.log('___API_GETTING_DAY___', {
        requestParameter: req.params.day,
        startTime: start,
        endTime: endTime,
        end: end.getTime()
    });
    let filters = {
        startTime: {
            $gt: Number(req.params.day)
        },
        endTime: {
            $lt: endTime
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
    const newBooking = new Booking({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        partySize: req.body.partySize,
        notified: false,
        msg: '',
        deleted: false,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        note: req.body.note
    });
    newBooking.save()
        .then((r) => {
            console.log('booking-saved:', r);
            res.json(`you has been added to the reservation`);
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
});

router.route('/delete/:id').post((req, res) => {
    console.log('---delete---', req.params.id, req.body.delete);
    Booking.findByIdAndUpdate(req.params.id, { deleted: req.body.delete || false })
        .then((r) => res.json(`${req.params.id} deleted`))
})


module.exports = router;