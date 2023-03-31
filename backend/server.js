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

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});