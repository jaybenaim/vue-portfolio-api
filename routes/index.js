const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  try {
    return res.status(200).send({
      status: 'success'
    });
  }

  catch (error) {
    return res.status(500).send({
      status: 'failed'
    });
  }
});

module.exports = router;
