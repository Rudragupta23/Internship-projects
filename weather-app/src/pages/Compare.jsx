import { useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Droplets, Wind, Thermometer } from 'lucide-react';

const Compare = () => {
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city, setCityData) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setCityData(response.data);
    } catch (err) {
      alert(`Could not find data for ${city}`);
    }
  };

  const CompareCard = ({ title, data, onSearch }) => {
    const [input, setInput] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (input.trim()) onSearch(input);
    };

    return (
      <div className="compare-column glass-panel">
        <h3 className="column-title">{title}</h3>
        
        {/* Search Bar ALWAYS stays at the top */}
        <form onSubmit={handleSubmit} className="search-bar small-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Enter city..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Go</button>
        </form>

        {/* Data section only appears if data exists, pushing down safely */}
        <div className="compare-data-wrapper">
          {data ? (
            <div className="compare-stats fade-in">
              <div className="c-header">
                <MapPin size={20} color="#61dafb" />
                <h2>{data.name}, {data.sys.country}</h2>
              </div>
              <h1 className="c-temp">{Math.round(data.main.temp)}°</h1>
              <p className="c-desc">{data.weather[0].description}</p>
              
              <div className="c-metrics-list">
                <div className="c-metric"><Thermometer size={18}/> Feels like: <span>{Math.round(data.main.feels_like)}°</span></div>
                <div className="c-metric"><Droplets size={18}/> Humidity: <span>{data.main.humidity}%</span></div>
                <div className="c-metric"><Wind size={18}/> Wind: <span>{data.wind.speed} m/s</span></div>
              </div>
            </div>
          ) : (
            <div className="empty-state">Search a city to compare</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="compare-header">
        <h2>Side-by-Side Analysis</h2>
      </div>

      <div className="pro-compare-grid">
        <CompareCard title="Location A" data={city1Data} onSearch={(c) => fetchWeather(c, setCity1Data)} />
        <div className="pro-vs-badge">VS</div>
        <CompareCard title="Location B" data={city2Data} onSearch={(c) => fetchWeather(c, setCity2Data)} />
      </div>
    </div>
  );
};

export default Compare;