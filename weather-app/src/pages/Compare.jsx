import { useState } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Gauge,
  Trophy
} from "lucide-react";

const Compare = () => {
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city, setData) => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      setData(res.data);
    } catch {
      alert(`Unable to find ${city}`);
    }
  };

  const calculateScore = (data) => {
    if (!data) return 0;

    let score = 100;

    if (data.main.temp > 35) score -= 20;
    if (data.main.temp < 10) score -= 15;

    if (data.main.humidity > 80) score -= 15;

    if (data.wind.speed > 10) score -= 10;

    return score;
  };

  const getWinner = () => {
    if (!city1Data || !city2Data) return null;

    return calculateScore(city1Data) > calculateScore(city2Data)
      ? city1Data.name
      : city2Data.name;
  };

  const CompareCard = ({ title, data, onSearch }) => {
    const [city, setCity] = useState("");

    const submitHandler = (e) => {
      e.preventDefault();

      if (city.trim()) {
        onSearch(city);
        setCity("");
      }
    };

    const score = calculateScore(data);

    return (
      <div className="compare-column glass-panel">
        <h3 className="column-title">{title}</h3>

        <form onSubmit={submitHandler} className="search-bar small-search">
          <Search size={18} />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
          />
          <button>Go</button>
        </form>

        {data && (
          <>
            <div className="compare-stats">
              <div className="c-header">
                <MapPin size={20} />
                <h2>
                  {data.name}, {data.sys.country}
                </h2>
              </div>

              <h1 className="c-temp">
                {Math.round(data.main.temp)}°
              </h1>

              <p className="c-desc">
                {data.weather[0].description}
              </p>

              <div className="weather-score">
                Weather Score
                <span>{score}/100</span>
              </div>

              <div className="c-metrics-list">

                <div className="c-metric">
                  <Thermometer size={18}/>
                  Feels Like
                  <span>{Math.round(data.main.feels_like)}°</span>
                </div>

                <div className="c-metric">
                  <Droplets size={18}/>
                  Humidity
                  <span>{data.main.humidity}%</span>
                </div>

                <div className="c-metric">
                  <Wind size={18}/>
                  Wind
                  <span>{data.wind.speed} m/s</span>
                </div>

                <div className="c-metric">
                  <Eye size={18}/>
                  Visibility
                  <span>{data.visibility / 1000} km</span>
                </div>

                <div className="c-metric">
                  <Gauge size={18}/>
                  Pressure
                  <span>{data.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">

      <div className="compare-header">
        <h1>Advanced Weather Comparison</h1>
        <p>Compare climate, comfort and conditions</p>
      </div>

      <div className="pro-compare-grid">
        <CompareCard
          title="Location A"
          data={city1Data}
          onSearch={(c) => fetchWeather(c, setCity1Data)}
        />

        <div className="pro-vs-badge">VS</div>

        <CompareCard
          title="Location B"
          data={city2Data}
          onSearch={(c) => fetchWeather(c, setCity2Data)}
        />
      </div>

      {city1Data && city2Data && (
        <div className="analysis-panel glass-panel">

          <h2>Detailed Weather Analysis</h2>

          <div className="winner-box">
            <Trophy />
            Best Weather:
            <span>{getWinner()}</span>
          </div>

          <div className="analysis-grid">

            <div>
              <h3>Temperature</h3>
              <p>
                {city1Data.main.temp > city2Data.main.temp
                  ? `${city1Data.name} is hotter`
                  : `${city2Data.name} is hotter`}
              </p>
            </div>

            <div>
              <h3>Humidity</h3>
              <p>
                {city1Data.main.humidity < city2Data.main.humidity
                  ? `${city1Data.name} feels less sticky`
                  : `${city2Data.name} feels less sticky`}
              </p>
            </div>

            <div>
              <h3>Wind Conditions</h3>
              <p>
                {city1Data.wind.speed > city2Data.wind.speed
                  ? `${city1Data.name} is windier`
                  : `${city2Data.name} is windier`}
              </p>
            </div>

            <div>
              <h3>Outdoor Activities</h3>
              <p>
                Recommended in {getWinner()}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Compare;