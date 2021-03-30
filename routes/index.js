const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    return res.status(200).send({
      success: true
    });
  }

  catch (error) {
    return res.status(500).send({
      success: false
    });
  }
});

module.exports = router;
