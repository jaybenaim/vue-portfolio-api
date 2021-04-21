const express = require("express");
const router = express.Router();
const validateEmail = require("../../validation/email");
require("dotenv").config();

// sendGrid setup
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/', async (req, res) => {
  // Validation
  const { errors, isValid } = validateEmail(req.body);
  if (!isValid) {
    return res.status(400).send({
      success: false,
      errors
    });
  } else {
    //    If validated send email
    const { name, email, message } = req.body;
    let html = `<div>${message} <br /> from ${name} - ${email}</div>`;
    let subject = `Portfolio Contact - ${name}`;

    const msg = {
      to: "benaimjacob@gmail.com",
      from: email,
      subject,
      text: message,
      html,
    };

    await sgMail
      .send(msg)
      // eslint-disable-next-line 
      .then((response) => {
        return res.status(200).send({
          success: true,
          data: {
            name, email, message
          }
        });
      })
      .catch((err) => {
        return res.status(500).send({
          success: false,
          data: err.response.body.errors
        });
      });
  }

});

module.exports = router;
