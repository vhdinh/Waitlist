const router = require('express').Router();
let Customer = require('../models/customer.model');

router.route('/').get((req, res) => {
    Customer.find()
        .then(c => res.json(c))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const partySize = req.body.partySize;

    const newCustomer = new Customer({name: name, phoneNumber: phoneNumber, partySize: partySize });

    newCustomer.save()
        .then(() => res.json('Customer added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;