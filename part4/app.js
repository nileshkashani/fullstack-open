const config = require('./utils/config')
const express = require('express')
const app = express()
const blogRouter = require('./routes/blogRoute')
const usersRouter = require('./routes/userRoute')
const loginRouter = require('./routes/loginRoute')
const middleware = require('./utils/middleware')
const connectDB = require('./config/mongoConfig')

connectDB()

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
