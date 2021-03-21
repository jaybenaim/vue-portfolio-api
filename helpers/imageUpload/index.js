const cloudinary = require("cloudinary");

const uploadImage = async (imagePath) => {

  const uploadResponse = await cloudinary.uploader.upload(req.body.image, (err, results) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(results)
    }
  });
}


module.exports = uploadImage