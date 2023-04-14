const router = require('express').Router();
let Booking = require('../models/booking.model');

router.route('/').get((req, res) => {
    Booking.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getToday').get((req, res) => {
    let today = new Date();
    today.setUTCHours(0,0,0,0);

    let tomorrow = new Date()
    tomorrow.setUTCHours(23,59,59,999);
    console.log('----TODAY----', tomorrow.getTime(), today.getTime());
    Booking.find({
        startTime: {
            $lt: today
        }
    })
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const newBooking = new Booking({
        name: 'Monica',
        phoneNumber: 2063838985,
        partySize: 50,
        notified: false,
        msg: '',
        deleted: false,
        startTime: 1681520400000, // 4/13 12pm
        endTime: 1681533000000, // 4/13 2pm
        note: ''
    });
    newBooking.save()
        .then((r) => {
            console.log('booking-saved:', r);
            res.json(`you has been added to the reservation`);
        })
        .catch(err => res.status(400).json('error-saving-user: ' + err));
})

module.exports = router;