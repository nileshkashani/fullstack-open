const app = require('express')()
const connectDB = require('./config/mongoConfig')
const blogRouter = require('./routes/blogRoute')

connectDB()

app.use(require('express').json())
app.use('/api/blogs', blogRouter)


const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
