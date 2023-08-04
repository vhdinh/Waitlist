const router = require('express').Router();
let Booking = require('../models/booking.model');

router.route('/').get((req, res) => {
    Booking.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getMonth/:startOfMonth/:endOfMonth').get((req, res) => {
    console.log('___API_GETTING_MONTH___', {
        startOfMonth: req.params.startOfMonth,
        endOfMonth: req.params.endOfMonth,
    })
    let filters = {
        startTime: {
            $gt: req.params.startOfMonth,
        },
        endTime: {
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
    const isAdmin = req.params.isAdmin === 'true' ? true : false;
    console.log('___API_GETTING_DAY___', {
        startOfDay: req.params.startOfDay,
        endOfDay: req.params.endOfDay,
    });
    let filters = {
        startTime: {
            $gt: Number(req.params.startOfDay),
        },
        endTime: {
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