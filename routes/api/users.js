const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

/** 
 * @todo REMOVE THIS IS FOR DEVELOPMENT ONLY 
 */
router.get("/", async (req, res) => {
  await User.find({}, (err, response) => {
    res.send(response)
  })
})
/** 
 * @END REMOVE 
 */

/**
 * Register User 
 *  
 * @route POST api/users/register
 * 
 * @access Public 
 */
router.post("/sign-up", (req, res) => {
  console.log(req.body)

  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }


  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).send({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAuthenticated: true
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

/**
 * Login via JWT 
 *  
 * @route POST api/users/login
 * 
 * @access Public
 */

router.post("/login", async (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  await User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).send({ email: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: user.image,
          isAuthenticated: true
        };
        // Sign token
        jwt.sign(
          payload,
          process.env.SECRET,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.status(200).send({
              success: true,
              user: payload,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .send({ hasErrors: true, password: "Password incorrect" });
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
  console.log(token)
  jwt.verify(token, process.env.SECRET, (err, verifiedJwt) => {
    if (err) {
      return res
        .status(400)
        .send({ hasErrors: true, error: err });
    } else {
      User.findByIdAndUpdate(verifiedJwt.id, {
        isAuthenticated: true
      }).then(userResponse => {
        res.status(200).send(userResponse)
      })
    }
  })
})

module.exports = router;