const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let isConnected = 0;
let db;

const DB_CONNECTION =
  process.env.NODE_ENV === "local"
    ? process.env.DB_CONNECTION
    : process.env.DB_PROD_CONNECTION;

console.log(process.env.NODE_ENV);

module.exports = async function connectToDatabase() {
  if (!isConnected) {
    console.log("connectToDatabase..., using new database connection");
    db = mongoose
      .connect(DB_CONNECTION, {
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
