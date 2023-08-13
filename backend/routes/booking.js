const router = require('express').Router();
let Booking = require('../models/booking.model');

router.route('/').get((req, res) => {
    Booking.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/getMonth/:startOfMonth/:endOfMonth').get((req, res) => {
    console.log('---route--- /getMonth/', req.params.startOfMonth, req.params.endOfMonth);
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
    console.log('---route--- /getDay/', req.params.startOfDay, req.params.endOfDay, req.params.isAdmin);
    const isAdmin = req.params.isAdmin === 'true' ? true : false;
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
    console.log('---route--- /add')
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
    console.log('---route--- /delete/', req.params.id, req.body.delete);
    Booking.findByIdAndUpdate(req.params.id, { deleted: req.body.delete || false })
        .then((r) => res.json(`${req.params.id} deleted`))
        .catch((e) => res.json(`${e}`));
})

router.route('/update/:id').post((req, res) => {
    console.log(`---route--- /update/`, req.params.id, req.body);
    Booking.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        partySize: req.body.partySize,
        notified: req.body.notified,
        msg: '',
        deleted: req.body.deleted,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        note: req.body.note
    }).then((r) => res.json(`${req.params.id} updated`))
        .catch((e) => res.json(`${e}`));

});


module.exports = router;