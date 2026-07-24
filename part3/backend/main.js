const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT

app.use(cors()) 
app.use(express.json())
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
let hadrcodedPersonData = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) =>
    res.send('hello'))

app.get('/api/persons', (req, resp) => {
    resp.json(hadrcodedPersonData);
})

app.get('/api/persons/:id', (req, resp) => {
    resp.json(hadrcodedPersonData.find(person => person.id === req.params.id))
})

app.get('api/persons/info', (req, resp) => {
    resp.send(`<p>Phonebook has info for ${hadrcodedPersonData.length} people</p><p>${new Date()}</p>`)
})

app.delete('/api/persons/:id', (req, resp) => {
    console.log("executed")
    const id = req.params.id
    hadrcodedPersonData = hadrcodedPersonData.filter(person => person.id !== id)
    resp.status(200).json("record deleted successfully!")
})

app.post('/api/persons', (req, resp) => {
    // console.log("api executed")
    const person = req.body
    if (!person.name) {
        return resp.status(400).json({ error: "Missing name" })
    }

    if (!person.number) {
        return resp.status(400).json({ error: "Missing number" })
    }

    if (hadrcodedPersonData.find(p => p.name === person.name)) {
        return resp.status(400).json({ error: "Name already exists" })
    } 
    const id = Math.floor(Math.random() * 100000).toString();
    person.id = id
    hadrcodedPersonData.push(person)
    resp.status(200).json(person)
})

app.listen(PORT, () =>
    console.log('server running on port' + PORT))
