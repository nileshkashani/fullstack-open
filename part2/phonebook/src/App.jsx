import { useEffect } from 'react'
import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState(null)
  const [searchedName, setSearchedName] = useState('')
  const submitName = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
    }
    else {
      setPersons([...persons, { name: newName, number: number }])
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={submitName}>
        <div>
          name: <input onChange={(e) => {
            setNewName(e.target.value)
          }} />
        </div>
        <div>
          number: <input onChange={(e) => {
            setNumber(e.target.value)
          }} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <input type="text" placeholder='search by name' onChange={(e) => setSearchedName(e.target.value)} />
      </div>
      <ul>
        {persons.filter(person => person.name.includes(searchedName)).map(person =>
          <li key={person.name}>
            {person.name} &nbsp;
            {person.number}
          </li>)}
      </ul>
    </div>
  )
}

export default App