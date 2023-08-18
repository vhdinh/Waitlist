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