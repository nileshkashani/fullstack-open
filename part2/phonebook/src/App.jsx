import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState(null)
  const [searchedName, setSearchedName] = useState('')
  const [isPhoneBookChanged, setIsPhoneBookChanged] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then((res) => { setPersons(res.data); console.log(res) })
      .catch((err) => console.log(err))
  }, [isPhoneBookChanged])

  const submitName = async (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      // console.log("if exected")
      if( confirm(`${newName} is already added to the phonebook do you want to replace the number?`) ){
        axios.put(`http://localhost:3001/persons/${persons.find(person => person.name === newName).id}`, {name: newName, number: number})
        .then(res => {alert("number updated successfully !"); setIsPhoneBookChanged(!isPhoneBookChanged)})
      }
    }
    else {
      // setPersons([...persons, { name: newName, number: number }])
      await axios.post('http://localhost:3001/persons', { name: newName, number: number })
        .then((res) => { console.log(res); setIsPhoneBookChanged(!isPhoneBookChanged) })
        .catch((err) => console.log(err))
    }
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/persons/${id}`)
      .then(res => {alert(`${res.data.name} is deleted successfully`); setIsPhoneBookChanged(!isPhoneBookChanged)})
      .catch(e => console.log(e))
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
          <li key={person.id}>
            {person.name} &nbsp;
            {person.number}
            <button onClick={() => handleDelete(person.id)} >delete</button>
          </li>)}
      </ul>
    </div>
  )
}

export default App