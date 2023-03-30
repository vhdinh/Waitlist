const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

const router = express.Router();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//TWILIO - TEXTING
const twilio = require('twilio');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
module.exports = router;

const customersRouter = require('./routes/customers');

app.use('/customers', customersRouter);

app.use("/notify", function(req, res) {
    console.log('going to notify', req.body);
    client.messages
        .create({
            body: `Hello ${req.body.name}, your table is ready`,
            to: '+12063838985', // Text this number
            from: process.env.TWILIO_PHONE_NUMBER, // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
    res.send({data: 'VU COOL'});
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});