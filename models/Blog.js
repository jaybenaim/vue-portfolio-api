const mongoose = require("mongoose");
const normalizeMongoose = require("normalize-mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
  },
  imageCaption: {
    type: String,
  },
  publishDate: {
    type: Date,
    default: new Date()
  },
  created: {
    type: Date,
    default: new Date()
  },
  updated: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: Array
  }
});

BlogSchema.plugin(normalizeMongoose)

module.exports = Blog = mongoose.model("blogs", BlogSchema);
