import React from 'react'
import './App.css'
import Weather from './components/Weather'
import UpComingWeather from './components/UpComingWeather'

const App = () => {
  return (
    <><div className='app'>
      <Weather />
    </div>
    <div className='querysection'>
      <footer>
          <p><b>For Any Query Contact:</b></p>
          <span>veereshkumar.b.s18@gmail.com</span>
          <p><b>(or)</b></p>
          <span>+91 9611581279</span>
      </footer>
    </div>
    </>
  )
}

export default App