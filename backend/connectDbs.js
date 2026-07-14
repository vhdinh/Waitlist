const mongoose = require("mongoose");
module.exports = (name, connString) => {
    const db = mongoose.createConnection(connString, { useNewUrlParser: true,  useUnifiedTopology: true });
    db.on('connected', () => {
        console.info(`${name} MongoDB connection succeeded!`);
    });
    db.on('error', (err) => {
        // Don't close the connection here - the driver's own topology
        // monitoring (useUnifiedTopology) already retries transient errors
        // (replica-set failover, brief network blips, etc) in the
        // background. Closing on every error turns a transient blip into a
        // permanent outage: nothing ever reopens this connection, so every
        // later query against it buffers and times out until the process
        // is restarted.
        console.error(`${name} MongoDB connection error, ` + err);
    });
    db.on('disconnected', () => {
        console.info(`${name} MongoDB connection disconnected!`);
    });
    process.on('SIGINT', () => {
        db.close().then(() => {
            console.info(`${name} Mongoose connection disconnected through app termination!`);
            process.exit(0);
        });
    });
    // EXPORT DB OBJECT
    return db;
}