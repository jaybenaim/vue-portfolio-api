const mongoose = require("mongoose");
require("dotenv").config();
//  Connect to DB
const db = process.env.MONGO_URI;
// Mongo options

var dbOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: false,
  useCreateIndex: true,
};
// Connect to MongoDB
mongoose
  .connect(db, dbOptions)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));
