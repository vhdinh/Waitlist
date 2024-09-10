const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app)

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
// connect to brick db
require("./connectDbs")(secondDB.name, secondDB.connStr);

const customersBrickRouter = require('./routes/customers.brick');
const bookingBrickRouter = require('./routes/booking.brick');

app.use('/brick/customers', customersBrickRouter);
app.use('/brick/booking', bookingBrickRouter);

const customersKumaRouter = require('./routes/customers.kuma');
const bookingKumaRouter = require('./routes/booking.kuma');

app.use('/kuma/customers', customersKumaRouter);
app.use('/kuma/booking', bookingKumaRouter);

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