import { useState } from 'react';
import { Search, Droplets, Wind, Thermometer } from 'lucide-react';

const WeatherCard = ({ title, weatherData, onSearch }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input);
  };

  return (
    <div className="weather-card glass-card">
      <h3 className="card-title">{title}</h3>
      <form onSubmit={handleSubmit} className="search-bar small">
        <input 
          type="text" 
          placeholder="Enter city..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit"><Search size={16} /></button>
      </form>

      {weatherData && (
        <div className="card-content">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <h1 className="card-temp">{Math.round(weatherData.main.temp)}°</h1>
          <p className="card-desc">{weatherData.weather[0].description}</p>
          
          <div className="card-metrics">
            <div className="metric"><Thermometer size={16}/> Feels: {Math.round(weatherData.main.feels_like)}°</div>
            <div className="metric"><Droplets size={16}/> Humidity: {weatherData.main.humidity}%</div>
            <div className="metric"><Wind size={16}/> Wind: {weatherData.wind.speed} m/s</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;