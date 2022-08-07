const mongoose = require("mongoose");
const { urlDb } = require("../config");
// -----------------------------------
//ERROR
// mongoose.connect(urlDb, {
//   useUnifiedTopology: true,
//   useFindAndModify: true,
//   useCreateIndex: true,
//   useNewUrlParser: true,
// });
// -----------------------------------
mongoose.connect(urlDb, (err) => {
  if (err) throw err;
  // console.log("connected to mongo");
});

const db = mongoose.connection;

module.exports = db;
