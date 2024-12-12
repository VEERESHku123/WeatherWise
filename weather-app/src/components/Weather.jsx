import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';

import UpComingWeather from './UpComingWeather'; // Ensure the path to this component is correct

import search_icon from '../assets/search.png';
import logo_icon from '../assets/sun.png';
import wind_icon from '../assets/anemometer.png';
import humidity_icon from '../assets/humidity.png';
import location_icon from '../assets/location.png';
import temp_icon from '../assets/summer.png';

const Weather = () => {
  const [city, setCity] = useState('London');
  const [WeatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const search = async (cityName) => {
    if (cityName.trim() === '') {
      alert('Enter a valid city name.');
      return;
    }

    try {
      const apiId = "26526e69e0bde56e1af8854706498f3c";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiId}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Extract timezone offset and calculate local time
      const timezoneOffset = data.timezone;
      const localDateTime = new Date(new Date().getTime() + timezoneOffset * 1000).toISOString();
      const localDate = localDateTime.split("T")[0];
      const localTime = localDateTime.split("T")[1].slice(0, 8);

      setWeatherData({
        temprature: Math.floor(data.main.temp),
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        location: data.name,
        localTime,
        localDate,
      });

      // Update the city for `UpComingWeather`
      setCity(cityName.trim());
    } catch (e) {
      setWeatherData(null);
      console.error('Error fetching weather data:', e);
    }
  };

  useEffect(() => {
    search('London'); // Fetch weather data for the default city on load
  }, []);

  return (
    <>
      <div className="headerSection">
        <img src={logo_icon} alt="logo" />
        <h1>WeatherWise</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search"
            ref={inputRef}
            onKeyDown={(e) => e.key === 'Enter' && search(inputRef.current.value)}
          />
          <img
            src={search_icon}
            alt="search"
            onClick={() => search(inputRef.current.value)}
          />
        </div>
      </div>
      {WeatherData ? (
        <div className="reportDisply">
          <h3>Current Weather report:</h3>
          <div className="localTimeDate">
            <p>Date: {WeatherData.localDate}</p>
            <p>Time: {WeatherData.localTime}</p>
          </div>
          <img src={location_icon} alt="location" />
          <div className="col">
            <p>{WeatherData.location}</p>
          </div>
          <img src={temp_icon} alt="temperature" />
          <div className="col">
            <span>Temperature</span>
            <p>{WeatherData.temprature}°C</p>
          </div>
          <img src={humidity_icon} alt="humidity" />
          <div className="col">
            <span>Humidity</span>
            <p>{WeatherData.humidity}%</p>
          </div>
          <img src={wind_icon} alt="wind" />
          <div className="col">
            <span>Wind Speed</span>
            <p>{WeatherData.windspeed} km/hr</p>
          </div>
        </div>
      ) : (
        <p>No weather data available. Please search for a city.</p>
      )}

      <div>
        <UpComingWeather city={city} />
      </div>
    </>
  );
};

export default Weather;
