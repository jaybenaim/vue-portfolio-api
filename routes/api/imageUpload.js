const express = require("express");
const { uploadImage } = require("../../helpers/imageUpload");
const cloudinary = require("cloudinary").v2;
const Axios = require('axios')

const router = express.Router();

router.post('/', async (req, res) => {

  const uploadResponse = await cloudinary.uploader.upload(req.body.image)
    .then(results =>
      res.status(200).send(results)
    ).catch(err =>
      res.status(500).send(err)
    );

  return uploadResponse
})

module.exports = router;
