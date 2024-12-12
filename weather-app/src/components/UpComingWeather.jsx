import React, { useEffect, useState } from 'react';
import './UpComingWeather.css';
import sun_icon from '../assets/sun1.png';

const UpComingWeather = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);

  const fetchForecast = async (cityName) => {
    try {
      const apiId = "26526e69e0bde56e1af8854706498f3c";
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiId}`;

      // Fetch latitude and longitude for the city
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeResponse.ok || geocodeData.length === 0) {
        alert('Error fetching city coordinates. Please check the city name.');
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Fetch weather forecast for the city
      const forecastUrl = `https:/api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiId}`;
      const response = await fetch(forecastUrl);

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Error fetching forecast data.');
        return;
      }

      const data = await response.json();

      // Group the forecast by day
      const groupedData = data.list.reduce((acc, item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});

      // Prepare 5-day forecast data
      const formattedData = Object.entries(groupedData)
        .slice(0, 5) // Limit to 5 days
        .map(([date, forecasts]) => {
          const avgTemp =
            forecasts.reduce((sum, f) => sum + f.main.temp, 0) / forecasts.length;
          const avgHumidity =
            forecasts.reduce((sum, f) => sum + f.main.humidity, 0) / forecasts.length;
          const avgWindSpeed =
            forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / forecasts.length;

          return {
            date,
            day: new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
            }),
            avgTemp: avgTemp.toFixed(1),
            avgHumidity: avgHumidity.toFixed(1),
            avgWindSpeed: avgWindSpeed.toFixed(1),
          };
        });

      setForecastData(formattedData);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      setForecastData([]);
    }
  };

  useEffect(() => {
    if (city) fetchForecast(city);
  }, [city]);

  return (
    <div className='daysReport'>
      <div>
        <h3>Day Weather Report</h3>
      </div>
      <div className="upComingWeatherData">
        {forecastData.length > 0 ? (
          forecastData.map((dayData, index) => (
            <div key={index} className="days">
              <p>{dayData.day}</p>
              <img src={sun_icon} alt="weather-icon" />
              <p><b>{dayData.date}</b></p>
              <p>Temperature: {dayData.avgTemp}°C</p>
              <p>Humidity: {dayData.avgHumidity}%</p>
              <p>Wind Speed: {dayData.avgWindSpeed} m/s</p>
            </div>
          ))
        ) : (
          <p>No forecast data available. Please check the city name.</p>
        )}
      </div>
    </div>
  );
};

export default UpComingWeather;
