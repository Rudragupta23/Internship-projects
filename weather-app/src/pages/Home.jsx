import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Droplets, Wind, Sunrise, Sunset, Eye, Gauge, Clock } from 'lucide-react';
import ForecastChart from '../components/ForecastChart';

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Reusable fetch function
  const fetchWeather = async (urlSuffix) => {
    setLoading(true);
    try {
      setError('');
      const currentRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${urlSuffix}&appid=${API_KEY}&units=metric`);
      setCurrentWeather(currentRes.data);

      const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?${urlSuffix}&appid=${API_KEY}&units=metric`);
      const dailyData = forecastRes.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      setForecast(dailyData);
    } catch (err) {
      setError('Location not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get user location on initial load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        },
        () => {
          // Fallback if user denies location
          fetchWeather(`q=London`);
        }
      );
    } else {
      fetchWeather(`q=London`);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(`q=${searchInput}`);
      setSearchInput('');
    }
  };

  // Calculate local time for the searched city
  const getLocalTime = (timezoneOffset) => {
    const d = new Date();
    const localTime = d.getTime() + (d.getTimezoneOffset() * 60000) + (timezoneOffset * 1000);
    return new Date(localTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (unix, timezoneOffset) => {
    const d = new Date((unix + timezoneOffset) * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSearch} className="search-bar pro-search">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search any global city..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loader"></div>}

      {!loading && currentWeather && (
        <div className="bento-dashboard">
          {/* Main Hero Tile */}
          <div className="bento-card hero-tile glass-panel">
            <div className="hero-header">
              <div className="location-badge">
                <MapPin size={18} />
                <h2>{currentWeather.name}, {currentWeather.sys.country}</h2>
              </div>
              <div className="time-badge">
                <Clock size={16} />
                <span>{getLocalTime(currentWeather.timezone)}</span>
              </div>
            </div>
            
            <div className="hero-body">
              <h1 className="massive-temp">{Math.round(currentWeather.main.temp)}°</h1>
              <div className="hero-condition">
                <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="icon" />
                <p>{currentWeather.weather[0].description}</p>
              </div>
            </div>
            
            <div className="hero-footer">
              <span>Feels like {Math.round(currentWeather.main.feels_like)}°</span>
            </div>
          </div>

          {/* Chart Tile */}
          <div className="bento-card chart-tile glass-panel">
            <ForecastChart data={forecast} />
          </div>

          {/* Small Metric Tiles */}
          <div className="bento-card mini-tile glass-panel">
            <Droplets size={24} className="tile-icon" />
            <p className="tile-label">Humidity</p>
            <p className="tile-value">{currentWeather.main.humidity}%</p>
          </div>
          
          <div className="bento-card mini-tile glass-panel">
            <Wind size={24} className="tile-icon" />
            <p className="tile-label">Wind Speed</p>
            <p className="tile-value">{currentWeather.wind.speed} m/s</p>
          </div>

          <div className="bento-card mini-tile glass-panel">
            <Sunrise size={24} className="tile-icon" />
            <p className="tile-label">Sunrise</p>
            <p className="tile-value">{formatTime(currentWeather.sys.sunrise, currentWeather.timezone)}</p>
          </div>

          <div className="bento-card mini-tile glass-panel">
            <Sunset size={24} className="tile-icon" />
            <p className="tile-label">Sunset</p>
            <p className="tile-value">{formatTime(currentWeather.sys.sunset, currentWeather.timezone)}</p>
          </div>

          {/* Forecast Row */}
          <div className="bento-card forecast-tile glass-panel">
            <h3 className="section-subtitle">5-Day Outlook</h3>
            <div className="pro-forecast-grid">
              {forecast.map((day, index) => {
                const date = new Date(day.dt * 1000);
                return (
                  <div key={index} className="pro-forecast-item">
                    <p className="f-day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="weather icon" />
                    <p className="f-temp">{Math.round(day.main.temp)}°</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;