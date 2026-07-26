require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('connected to MongoDB')
    }).catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
}
module.exports = connectDB