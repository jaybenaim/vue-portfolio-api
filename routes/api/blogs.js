const express = require("express");
const router = express.Router();

const Blog = require("../../models/Blog");

/** 
 * GET All Blogs
 */
router.get('/', (req, res) => {
  Blog.find({}).then(blog => {
    res.status(200).send(blog)

  }).catch(err => {
    res.status(500).send(err)
  })
})

/** 
 * CREATE New Blog
 */
router.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog.save()
    .then(blogResponse => res.status(200).send(blogResponse))
    .catch(err => res.status(500).send(err))
})

/** 
 * UPDATE Update Blog
 */
router.patch('/:id', (req, res) => {
  const newBlog = req.body
  const id = req.params.id
  const options = {
    new: true,
    setDefaultsOnInsert: true,
    upsert: true
  }

  newBlog.updated = Date.now()

  Blog.findByIdAndUpdate(
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
router.delete('/:id', (req, res) => {
  const id = req.params.id

  Blog.findOneAndDelete(id)
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
