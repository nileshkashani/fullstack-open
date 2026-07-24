import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const notification = (message) => {
  return (
    <div style={{ border: '2px solid red', margin: '10px', padding: '10px' }}>
      {message}
    </div>
  );
}

const baseUrl = '/api/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [number, setNumber] = useState(null)
  const [searchedName, setSearchedName] = useState('')
  const [isPhoneBookChanged, setIsPhoneBookChanged] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isNotificationActive, setIsNotificationActive] = useState(false)

  useEffect(() => {
    axios.get(`${baseUrl}`)
      .then((res) => { setPersons(res.data); console.log(res) })
      .catch((err) => console.log(err))
  }, [isPhoneBookChanged])

  const submitName = async (event) => {
    event.preventDefault()
    await axios.post(`${baseUrl}`, { name: newName, number: number })
      .then(res => {
        setIsPhoneBookChanged(!isPhoneBookChanged)
        setNotificationMessage(`${newName} added to phonebook successfully!`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
      .catch((err) => {
        setNotificationMessage(`failed to add ${newName} to phonebook`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
  }
  const handleDelete = (id) => {
    axios.delete(`${baseUrl}/${id}`)
      .then(res => {
        setNotificationMessage(`${res.data.name} is deleted successfully`)
        setIsPhoneBookChanged(!isPhoneBookChanged)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
      .catch(e => {
        console.log("catch executed")
        setNotificationMessage(`failed to delete because person with this record is already deleted`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <div style={{ height: isNotificationActive === true ? '10vh' : '0px' }}>
        {isNotificationActive === true && notification(notificationMessage)}
      </div>
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