const config = require('./utils/config')
const express = require('express')
const app = express()
const blogRouter = require('./routes/blogRoute')
const middleware = require('./utils/middleware')
const connectDB = require('./config/mongoConfig')

connectDB()

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
