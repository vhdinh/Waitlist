const mongoose = require("mongoose");
module.exports = (name, connString) => {
    const db = mongoose.createConnection(connString, { useNewUrlParser: true,  useUnifiedTopology: true });
    db.on('connected', () => {
        console.info(`${name} MongoDB connection succeeded!`);
    });
    db.on('error', (err) => {
        console.error(`${name} MongoDB connection failed, ` + err);
        db.close();
    });
    db.on('disconnected', () => {
        console.info(`${name} MongoDB connection disconnected!`);
    });
    process.on('SIGINT', () => {
        mongoose.connection.close().then(() => {
            winston.info(`${name} Mongoose connection disconnected through app termination!`);
            process.exit(0);
        });
    });
    // EXPORT DB OBJECT
    return db;
}