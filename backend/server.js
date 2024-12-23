const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app)
const fs = require('fs');

require('dotenv').config();

const corsOptions = {
    AccessControlAllowOrigin: '*',
    origin: `${process.env.UI_URL}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
const router = express.Router();

// write gc file
const googleKeys = {
    "type": process.env.GOOGLE_CAL_TYPE,
    "project_id": process.env.GOOGLE_CAL_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_CAL_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_CAL_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    "client_email": process.env.GOOGLE_CAL_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_CAL_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_CAL_AUTH_URI,
    "token_uri": process.env.GOOGLE_CAL_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_CAL_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.GOOGLE_CAL_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.GOOGLE_CAL_UNIVERSE_DOMAIN
}


fs.writeFileSync('../backend/reservation-calendar.json', JSON.stringify(googleKeys));

/**
 *  FIRST DB CONNECTION
 *  ===================
 * */

// UPDATE YOUR DEFAULTS
const firstDB = {
    name: "Brick", // for demo
    connStr: process.env.BRICK_MONGODB_URL,
    db: "brick",
    coll: "brick"
};
// connect to brick db
require("./connectDbs")(firstDB.name, firstDB.connStr);

/**
 *  SECOND DB CONNECTION
 *  ===================
 * */

// UPDATE YOUR DEFAULTS
const secondDB = {
    name: "Kuma", // for demo
    connStr: process.env.KUMA_MONGODB_URL,
    db: "kuma",
    coll: "kuma"
};

// connect to kuma db
require("./connectDbs")(secondDB.name, secondDB.connStr);

/**
 *  THIRD DB CONNECTION
 *  ===================
 * */

// UPDATE YOUR DEFAULTS
const thirdDB = {
    name: "1988", // for demo
    connStr: process.env.EIGHT_MONGODB_URL,
    db: "1988",
    coll: "1988"
};

// connect to 1988 db
require("./connectDbs")(thirdDB.name, thirdDB.connStr);

const customersBrickRouter = require('./routes/customers.brick');
const bookingBrickRouter = require('./routes/booking.brick');

app.use('/brick/customers', customersBrickRouter);
app.use('/brick/booking', bookingBrickRouter);

const customersKumaRouter = require('./routes/customers.kuma');
const bookingKumaRouter = require('./routes/booking.kuma');

app.use('/kuma/customers', customersKumaRouter);
app.use('/kuma/booking', bookingKumaRouter);

const customersEightRouter = require('./routes/customers.eight');
const bookingEightRouter = require('./routes/booking.eight');

app.use('/eight/customers', customersEightRouter);
app.use('/eight/booking', bookingEightRouter);

const googleCalendarRouter = require('./routes/calendar.kuma');
app.use('/google-calendar', googleCalendarRouter);

const io = new Server(server, {
    cors: {
        origin: process.env.UI_URL,
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
   console.log('----client connected:', socket.id);
   socket.on('disconnect', (reason) => {
       console.log('disconnected: ', reason);
   });
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;

server.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port: ${process.env.PORT || 3001}`);
});