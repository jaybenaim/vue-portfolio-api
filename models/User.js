const mongoose = require("mongoose");
const normalizeMongoose = require("normalize-mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  image: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(normalizeMongoose)

module.exports = User = mongoose.model("users", UserSchema);
