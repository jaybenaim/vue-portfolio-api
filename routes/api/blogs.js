const express = require("express");
const { uploadImage } = require("../../helpers/imageUpload");
const router = express.Router();

const Blog = require("../../models/Blog");

/** 
 * GET All Blogs
 */
router.get('/', async (req, res) => {
  await Blog.find({}).then(blog => {
    res.status(200).send(blog)

  }).catch(err => {
    res.status(500).send(err)
  })
})

/** 
 * CREATE New Blog
 */
router.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (blog.image) {
    /** 
     * @todo upload to cloudinary
     * @return url as string 
     * @set blog.image to url 
     */
    blog.image = await uploadImage(blog.image)
  }

  blog.save()
    .then(blogResponse => res.status(200).send(blogResponse))
    .catch(err => res.status(500).send(err))
})

/** 
 * UPDATE Update Blog
 */
router.patch('/:id', async (req, res) => {
  const newBlog = req.body
  const id = req.params.id
  const options = {
    new: true,
    setDefaultsOnInsert: true,
    upsert: true
  }

  newBlog.updated = Date.now()

  await Blog.findByIdAndUpdate(
    id,
    { $set: newBlog },
    options)
    .then(blogResponse => {
      res.status(200).send(blogResponse)
    })
    .catch(err => res.status(500).send(err))
})

/**
 * DELETE Remove Doc
 */
router.delete('/:id', async (req, res) => {
  const id = req.params.id

  await Blog.findOneAndDelete(id)
    .then(response =>
      res.status(200)
        .send({
          status: 'success'
        }))
    .catch(err =>
      res.status(500)
        .send({
          status: 'failed'
        }))
})

module.exports = router;
