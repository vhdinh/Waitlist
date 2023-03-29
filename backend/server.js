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

const uri = "mongodb+srv://isthisvu:0K5FKdfWQwJteYAH@cluster0.2xtyt2k.mongodb.net/brick?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

//TWILIO - TEXTING
const twilio = require('twilio');
const accountSid = 'AC6c79d0d23c22e3a85192d9b722441601'; // Your Account SID from www.twilio.com/console
const authToken = '5428c4983d80e3181cb89e3072eb4730'; // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);
module.exports = router;

const customersRouter = require('./routes/customers');

app.use('/customers', customersRouter);

app.use("/notify", function(req, res) {
    console.log('going to notify', req.body);
    client.messages
        .create({
            body: `Hello ${req.body.name}, your table is ready`,
            to: '+12063838985', // Text this number
            from: '+18888147551', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
    res.send({data: 'VU COOL'});
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});