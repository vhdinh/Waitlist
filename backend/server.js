const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const fs = require("fs");
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app)

require('dotenv').config();

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
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

const customersRouter = require('./routes/customers');
const bookingRouter = require('./routes/booking');

app.use('/customers', customersRouter);
app.use('/booking', bookingRouter);

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port: ${process.env.PORT || 5000}`);
});