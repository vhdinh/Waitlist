const mongoose = require("mongoose");

// Each restaurant's customer/booking models call this with the same
// connString (they share one physical DB). Without caching, every model
// file's `require("../connectDbs")(...)` call opened its own brand-new
// connection + pool via mongoose.createConnection(), doubling the number of
// open connections per restaurant DB for no benefit. Memoizing by connString
// means the second model just reuses the first connection.
const connectionCache = {};

module.exports = (name, connString) => {
    if (connectionCache[connString]) {
        return connectionCache[connString];
    }
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
    connectionCache[connString] = db;
    // EXPORT DB OBJECT
    return db;
}