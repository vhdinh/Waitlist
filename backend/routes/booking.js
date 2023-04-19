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
    Booking.find({
        startTime: {
            $gt: firstDay.getTime()
        },
        endTime: {
            $lt: lastDay.getTime()
        }
    })
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/getDay/:day').get((req, res) => {
    const start = new Date(parseInt(req.params.day)).setHours(0,0,0,0);
    let end = new Date(start);
    end.setHours(23,59,59,999);
    Booking.find({
        startTime: {
            $gt: start
        },
        endTime: {
            $lt: end.getTime()
        }
    })
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const newBooking = new Booking({
        name: 'April25Anniversary',
        phoneNumber: 2063838985,
        partySize: 50,
        notified: false,
        msg: '',
        deleted: false,
        startTime: 1682370000000,
        endTime: 1682383800000,
        note: '5 year anniversary. Please make it special, i am testing a long note and want to see what happens. Why why istthis happening?'
    });
    console.log('-------', newBooking);
    newBooking.save()
        .then((r) => {
            console.log('booking-saved:', r);
            res.json(`you has been added to the reservation`);
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
    // res.json('Cool Vu');
})

module.exports = router;