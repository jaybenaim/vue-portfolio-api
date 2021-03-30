const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const Blog = require("../../models/Blog");
const validateNewBlog = require('../../validation/blogs')

/** 
 * GET All Blogs
 */
router.get('/', async (req, res) => {

  await Blog.find().populate('uid', 'name username id image', User).exec()
    .then(response => {
      res.status(200).send({
        success: true,
        blogs: response
      })
    }).catch(error => {
      console.log(error)
      res.status(500).send({
        success: false,
        error
      })
    })

})

/** 
 * GET By User Id 
 */
router.get('/find', async (req, res) => {
  const userId = req.query.user

  await Blog.find({
    'uid': userId
  })
    .populate('uid', 'name username id image', User)
    .exec()
    .then(blogResponse => {
      res.status(200).send({
        success: true,
        blogs: blogResponse
      })

    }).catch(err => {
      console.log(err)
      res.status(500).send({
        success: false,
        error: err
      })
    })
})

/** 
 * GET By Id 
 */
router.get('/:id', async (req, res) => {
  const blogId = req.params.id

  await Blog.findById(blogId).then(blog => {
    res.status(200).send({
      success: true,
      blog
    })

  }).catch(err => {
    res.status(500).send({
      success: false,
      error: err
    })
  })
})


/** 
 * CREATE New Blog
 */
router.post('/new', async (req, res) => {
  // Form validation
  const { errors, isValid } = validateNewBlog(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).send(errors);
  }

  const newBlog = req.body
  newBlog.uid = newBlog.uid.id

  const blog = new Blog(newBlog)

  return await blog.save()
    .then(blogResponse => res.status(200).send({
      success: true,
      blog: blogResponse
    }))
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        success: false,
        error: err
      })
    })
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
  newBlog.uid = newBlog.uid.id

  await Blog.findByIdAndUpdate(
    id,
    { $set: newBlog },
    options)
    .then(blogResponse => {
      res.status(200).send({
        success: true,
        blog: blogResponse
      })
    })
    .catch(err => res.status(500).send({
      success: false,
      error: err
    }))
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
          success: true
        }))
    .catch(err =>
      res.status(500)
        .send({
          success: false,
          error: err
        }))
})

module.exports = router;
