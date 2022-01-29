const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let isConnected = 0;
let db;

module.exports = async function connectToDatabase() {
  if (!isConnected) {
    console.log("connectToDatabase..., using new database connection");
    db = mongoose
      .connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        bufferCommands: false,
      })
      .then((db) => db);
    db = await db;
    isConnected = db.connections.readyState;
  } else {
    console.log("using exist database connection");
  }
  return db;
};
