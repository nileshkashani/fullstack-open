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
  const [number, setNumber] = useState('')
  const [searchedName, setSearchedName] = useState('')
  const [isPhoneBookChanged, setIsPhoneBookChanged] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [isNotificationActive, setIsNotificationActive] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [infoHtml, setInfoHtml] = useState('')

  useEffect(() => {
    axios.get(`${baseUrl}`)
      .then((res) => { setPersons(res.data); console.log(res) })
      .catch((err) => console.log(err))
  }, [isPhoneBookChanged])

  const submitName = async (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        axios.put(`${baseUrl}/${existingPerson.id}`, { name: newName, number: number })
          .then(res => {
            setIsPhoneBookChanged(!isPhoneBookChanged)
            setNotificationMessage(`Updated number for ${newName} successfully!`)
            setIsNotificationActive(true)
            setTimeout(() => {
              setIsNotificationActive(false)
            }, 5000)
            if (selectedPerson && selectedPerson.id === existingPerson.id) {
              setSelectedPerson(res.data)
            }
          })
          .catch(() => {
            setNotificationMessage(`failed to update ${newName}`)
            setIsNotificationActive(true)
            setTimeout(() => {
              setIsNotificationActive(false)
            }, 5000)
          })
      }
      return
    }

    await axios.post(`${baseUrl}`, { name: newName, number: number })
      .then(() => {
        setIsPhoneBookChanged(!isPhoneBookChanged)
        setNotificationMessage(`${newName} added to phonebook successfully!`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
      .catch(() => {
        setNotificationMessage(`failed to add ${newName} to phonebook`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
  }

  const handleDelete = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    const nameToDelete = personToDelete ? personToDelete.name : 'Person'
    
    axios.delete(`${baseUrl}/${id}`)
      .then(() => {
        setNotificationMessage(`${nameToDelete} is deleted successfully`)
        setIsPhoneBookChanged(!isPhoneBookChanged)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
        if (selectedPerson && selectedPerson.id === id) {
          setSelectedPerson(null)
        }
      })
      .catch(() => {
        console.log("catch executed")
        setNotificationMessage(`failed to delete because person with this record is already deleted`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
  }

  const handleShowDetails = (id) => {
    axios.get(`${baseUrl}/${id}`)
      .then(res => {
        setSelectedPerson(res.data)
      })
      .catch(() => {
        setNotificationMessage(`failed to fetch person details`)
        setIsNotificationActive(true)
        setTimeout(() => {
          setIsNotificationActive(false)
        }, 5000)
      })
  }

  const handleShowInfo = () => {
    axios.get('/info')
      .then(res => {
        setInfoHtml(res.data)
      })
      .catch(() => {
        setNotificationMessage(`failed to fetch phonebook info`)
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
        {persons.filter(person => person.name.toLowerCase().includes(searchedName.toLowerCase())).map(person =>
          <li key={person.id}>
            {person.name} &nbsp;
            {person.number} &nbsp;
            <button onClick={() => handleShowDetails(person.id)}>view details</button> &nbsp;
            <button onClick={() => handleDelete(person.id)} >delete</button>
          </li>)}
      </ul>

      {selectedPerson && (
        <div>
          <h3>Person Details</h3>
          <p>ID: {selectedPerson.id}</p>
          <p>Name: {selectedPerson.name}</p>
          <p>Number: {selectedPerson.number}</p>
          <button onClick={() => setSelectedPerson(null)}>close details</button>
        </div>
      )}

      <div>
        <h2>Statistics</h2>
        <button onClick={handleShowInfo}>Show statistics info</button>
        {infoHtml && (
          <div>
            <div dangerouslySetInnerHTML={{ __html: infoHtml }} />
            <button onClick={() => setInfoHtml('')}>hide statistics</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App