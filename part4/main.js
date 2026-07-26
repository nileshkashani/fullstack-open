const app = require('express')()
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


//blog schema

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})


const Blog = mongoose.model('Blog', blogSchema)

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('connected to MongoDB')
}).catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
})

app.use(require('express').json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
