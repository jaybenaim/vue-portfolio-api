const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const blogs = require("./routes/api/blogs");
const imageUpload = require("./routes/api/imageUpload");
const email = require("./routes/api/email");
const cors = require("cors");
const CONSTANTS = require("./constants");
const { PORT: port } = CONSTANTS;
const passport = require("passport");
const indexRouter = require("./routes");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
require("./config/db");

const app = express();

// Bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   bodyParser.urlencoded({
//     extended: false,
//   })
// );
// app.use(bodyParser.json());


// Cors
const whitelist = [
  "http://localhost:8080",
  "https://jaybenaim.github.io",
  "http://localhost:5000",
  "http://localhost:5000",
];

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "build")));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// IMAGE UPLOADER 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

/**
 * ROUTES
 */
app.use("/api", indexRouter);
app.use("/api/users", users);
app.use("/api/blogs", blogs);
app.use('/api/image-upload', imageUpload)
app.use('/api/email', email)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// TODO Web Template Studio: Add your own error handler here.
if (process.env.NODE_ENV === "production") {
  // Do not send stack trace of error message when in production
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send("Error occurred while handling the request.");
  });
} else {
  // Log stack trace of error message while in development

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.send(err.message);
  });
}

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

module.exports = app;
