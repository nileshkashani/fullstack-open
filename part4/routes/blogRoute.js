const blogRouter = require('express').Router()
const Blog = require("../models/BlogModel")

blogRouter.get('/get', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogRouter.post('/add', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter;