const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/sign-up", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.isAuthenticated = true

          newUser
            .save()
            .then((user) => res.send({
              success: true,
              user
            }))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(400).send({ email: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              user: payload,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ sucess: false, passwordincorrect: "Password incorrect" });
      }
    });
  });
});

/**
 * Check if user has a valid token, then update the User `isAuthenticated` state. 
 * 
 * @route Get 
 * 
 * @query token - Bearer Token 
 * 
 * @acess Public
 */
router.get('/verify', (req, res) => {
  const { token } = req.query

  jwt.verify(token, process.env.SECRET, (err, verifiedJwt) => {
    if (err) {
      res
        .status(400)
        .send({
          success: false,
          error: err
        })
    } else {
      // If there is a verified token change the `isAuthenticated` status to true
      User.findByIdAndUpdate(verifiedJwt.id, {
        $set: {
          isAuthenticated: true
        }
      }, {
        new: true,
        select: 'name email createdOn isAuthenticated'
      }).then(userResponse => {

        res.status(200).send(userResponse)
      }).catch(error => {
        return res
          .status(400)
          .send({
            success: false,
            error
          });
      })
    }
  })
})

module.exports = router;
