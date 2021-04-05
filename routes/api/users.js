const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

router.get('/', (r, s) => {
  User.find({}).then(res => s.send(res))
})

router.get('/delete', (r, s) => {
  User.deleteMany({}).then(res => s.send(res))
})
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
  return await User.findOne({ email })
    .then((user) => {
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
              if (err) {
                res.send({
                  success: false,
                  error: err
                })
              } else {
                res.send({
                  success: true,
                  user,
                  token: "Bearer " + token,
                });
              }
            }
          );
        } else {
          return res
            .status(400)
            .send({ sucess: false, password: "Password incorrect" });
        }
      });
    }).catch(error => {
      console.log(error)
      res.status(500).send({
        success: false,
        error
      })
    })
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
        select: 'name email image username createdOn isAuthenticated'
      }).then(userResponse => {
        res.status(200).send({
          success: true,
          user: userResponse
        })
      }).catch(error => {
        res
          .status(400)
          .send({
            success: false,
            error
          });
      })
    }
  })
})

router.patch('/:id', async (req, res) => {
  const id = req.params.id
  const newUserProfile = req.body

  await User.findByIdAndUpdate(id,
    {
      $set: {
        username: newUserProfile.username,
        email: newUserProfile.email,
        image: newUserProfile.image
      }
    },
    {
      new: true,
      fields: 'name email image username createdOn isAuthenticated'
    }
  ).then((userResponse) => {
    res.status(200).send({
      success: true,
      user: userResponse
    })
  }).catch(error => {
    res.status(400).send({
      success: false,
      error
    })
  })

})

module.exports = router;
