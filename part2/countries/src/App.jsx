import { useEffect } from "react"
import axios from 'axios'
import { useState } from "react"

function App() {
  const [countries, setCountries] = useState([])
  const [searchedCountries, setSearchedCountries] = useState([])
  const [searchedName, setSearchedName] = useState('')
  const [weather, setWeather] = useState(null)
  
  useEffect(() => {
    console.log(weather)
  }, [weather])
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => {
        setCountries(res.data)
        setSearchedCountries(res.data)
      })
  }, [])


  const filteredCountries = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(searchedName.toLowerCase())
  )


  const handleShowView = (name) => {
    setSearchedName(name)
    setSearchedCountries(countries.filter(country =>
      country.name.common
        .toLowerCase()
        .includes(name.toLowerCase())
    ))
  }

  const matchedCountry = filteredCountries.length === 1 ? filteredCountries[0] : null
  const matchedCountryName = matchedCountry ? matchedCountry.name.common : ''

  useEffect(() => {
    if (matchedCountry) {
      axios.get(`${import.meta.env.VITE_OPENWEATHER_BASE_URL}/?&lat=${matchedCountry.latlng[0]}&lon=${matchedCountry.latlng[1]}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`)
        .then(res => {
          // console.log(res)
          setWeather(res)
        })
    }
  }, [matchedCountryName])
  return (
    <>
      <input type="text" placeholder='find countries' onChange={(e) => setSearchedName(e.target.value)} />
      {searchedName.length > 0 && filteredCountries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {searchedName.length > 0 && filteredCountries.length <= 10 && (
        <div>
          {filteredCountries.map(country => (
            <p key={country.cca3}>
              {country.name.common} <button onClick={() => handleShowView(country.name.common)}>Show</button>
            </p>
          ))}
        </div>
      )}

      {filteredCountries.length == 1 &&
      <div>
        <h2>{filteredCountries[0].name.common}</h2>
        <p><b>Capital: </b>{filteredCountries[0].capital}</p>
        <p><b>Area: </b>{filteredCountries[0].area}</p>
        <p><b>Population: </b>{filteredCountries[0].population}</p>
        <h3>Spoken languages:</h3>
        <ul>
          {Object.values(filteredCountries[0].languages).map(language => (
            <li key={language}>
              {language}
            </li>
          ))}
        </ul>
        {/* {console.log(filteredCountries[0].flags.png)} */}
        <img src={filteredCountries[0].flags.png} alt="flag" />
        <h1>Weather in {filteredCountries[0].capital}</h1>
        {weather ? (
          <div>
            <div>temp {((weather.data.main.temp - 32) * (5 / 9)).toFixed(1)}°C</div>
            <img src={`https://openweathermap.org/payload/api/media/file/${weather.data.weather[0].icon}.png`} alt="no icon" />
            <div>speed {weather.data.wind.speed}</div>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}
      </div>
      }
    </>
  )
}

export default App
