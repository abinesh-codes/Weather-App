import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatTemp, formatWindSpeed, formatTime } from '../utils/formatters';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog, WiThermometer 
} from 'react-icons/wi';
import { FiDroplet, FiWind } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Background Image assets matching dynamic weather conditions
import sunnyBg from '../assets/images/sunny.png';
import cloudyBg from '../assets/images/cloudy.png';
import rainyBg from '../assets/images/rainy.png';
import nightBg from '../assets/images/night.png';
import thunderstormBg from '../assets/images/thunderstorm.png';
import snowyBg from '../assets/images/snowy.png';

const HeroWeather = () => {
  const { weatherData, activeLocation, units } = useWeather();

  const current = weatherData?.current;
  const weatherTheme = weatherData?.weatherTheme || 'sunny';

  // Map theme to correct background image asset
  const cardBgImage = useMemo(() => {
    switch (weatherTheme) {
      case 'sunny': return sunnyBg;
      case 'night':
      case 'night-cloudy': return nightBg;
      case 'cloudy': return cloudyBg;
      case 'rainy': return rainyBg;
      case 'thunderstorm': return thunderstormBg;
      case 'snowy': return snowyBg;
      default: return sunnyBg;
    }
  }, [weatherTheme]);

  // Map OpenWeather icon code to beautiful, high-quality weather icons
  const WeatherIconComponent = useMemo(() => {
    if (!current) return WiDaySunny;
    const iconCode = current.weather[0].icon;
    
    switch (iconCode) {
      case '01d': return WiDaySunny;
      case '01n': return WiNightClear;
      case '02d': return WiDayCloudy;
      case '02n': return WiNightAltCloudy;
      case '03d':
      case '03n': return WiCloud;
      case '04d':
      case '04n': return WiCloudy;
      case '09d':
      case '09n': return WiShowers;
      case '10d':
      case '10n': return WiRain;
      case '11d':
      case '11n': return WiThunderstorm;
      case '13d':
      case '13n': return WiSnow;
      case '50d':
      case '50n': return WiFog;
      default: return WiDaySunny;
    }
  }, [current]);

  // Format local date: e.g. "Monday, 19 May"
  const formattedDate = useMemo(() => {
    if (!current || !weatherData) return '';
    const date = new Date((current.dt + weatherData.current.timezone) * 1000);
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (1000 * weatherData.current.timezone));
    
    const weekday = localDate.toLocaleDateString('en-US', { weekday: 'long' });
    const day = localDate.getDate();
    const month = localDate.toLocaleDateString('en-US', { month: 'short' });
    return `${weekday}, ${day} ${month}`;
  }, [current, weatherData]);

  // Format local time: e.g. "12:30 AM"
  const formattedTime = useMemo(() => {
    if (!current || !weatherData) return '';
    return formatTime(current.dt, weatherData.current.timezone, true);
  }, [current, weatherData]);

  // Calculate highest chance of rain from next few hours
  const rainChance = useMemo(() => {
    if (!weatherData) return 0;
    const popList = weatherData.hourly.map(h => h.rainChance);
    return Math.max(...popList, 0);
  }, [weatherData]);

  // Short, descriptive summary sentence
  const shortSummary = useMemo(() => {
    if (!current || !weatherData) return '';
    const cond = current.weather[0].description;
    
    let condText = cond.charAt(0).toUpperCase() + cond.slice(1);
    let rainText = 'No rain is expected.';
    if (rainChance > 60) {
      rainText = 'Rain is highly expected today.';
    } else if (rainChance > 20) {
      rainText = 'Light showers are possible today.';
    }

    return `${condText} skies through the day. ${rainText}`;
  }, [current, weatherData, rainChance]);

  if (!weatherData || !current) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="hero-weather-container"
      style={{ backgroundImage: `url(${cardBgImage})` }}
    >
      {/* Background shading overlay to ensure text contrast */}
      <div className="hero-weather-overlay"></div>

      <div className="hero-content">
        {/* Top Header Row - Local Time & Date */}
        <div className="hero-top">
          <span className="hero-date">{formattedDate}</span>
          <span className="hero-time">{formattedTime}</span>
        </div>

        {/* Main Temperature and Conditions Body */}
        <div className="hero-middle">
          <div className="temp-large-row">
            <h2 className="temp-display">{Math.round(current.main.temp)}</h2>
            <span className="temp-unit">°{units === 'metric' ? 'C' : 'F'}</span>
          </div>
          <h3 className="condition-label">{current.weather[0].description}</h3>
          <div className="feels-like-pill">
            <WiThermometer className="thermometer-icon" />
            <span>Feels like {formatTemp(current.main.feels_like, units)}</span>
          </div>
          <div className="temp-range">
            <span>H: {formatTemp(current.main.temp_max, units)}</span>
            <span className="divider">|</span>
            <span>L: {formatTemp(current.main.temp_min, units)}</span>
          </div>
        </div>

        {/* Bottom Section - Divider, Summary and Weather Metrics Grid */}
        <div className="hero-bottom-section">
          <hr className="bottom-divider" />
          <span className="bottom-summary">{shortSummary}</span>
          
          <div className="bottom-widgets-row">
            {/* Chance of Rain */}
            <div className="bottom-widget-col">
              <WiShowers className="widget-icon" />
              <div className="widget-info">
                <span className="widget-label">Chance of Rain</span>
                <span className="widget-value">{rainChance}%</span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bottom-widget-col">
              <FiDroplet className="widget-icon" />
              <div className="widget-info">
                <span className="widget-label">Humidity</span>
                <span className="widget-value">{current.main.humidity}%</span>
              </div>
            </div>

            {/* Wind */}
            <div className="bottom-widget-col">
              <FiWind className="widget-icon" />
              <div className="widget-info">
                <span className="widget-label">Wind</span>
                <span className="widget-value">{formatWindSpeed(current.wind.speed, units)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-weather-container {
          width: 100%;
          min-height: 480px;
          border: 1px solid var(--card-border);
          box-shadow: var(--glass-shadow);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          color: #ffffff !important;
          display: flex;
          flex-direction: column;
          background-size: cover;
          background-position: center;
        }

        .hero-weather-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom, 
            rgba(15, 23, 42, 0.15) 0%, 
            rgba(15, 23, 42, 0.45) 50%, 
            rgba(15, 23, 42, 0.8) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          flex-grow: 1;
          gap: 25px;
        }

        .hero-top {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hero-date {
          font-size: 0.95rem;
          font-weight: 700;
          opacity: 0.95;
          letter-spacing: 0.2px;
        }

        .hero-time {
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0.75;
        }

        .hero-middle {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin-top: 10px;
        }

        .temp-large-row {
          display: flex;
          align-items: flex-start;
        }

        .temp-display {
          font-size: 6rem;
          font-weight: 800;
          line-height: 0.85;
          letter-spacing: -3px;
        }

        .temp-unit {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 8px;
          margin-left: 2px;
          opacity: 0.9;
        }

        .condition-label {
          font-size: 1.3rem;
          font-weight: 700;
          text-transform: capitalize;
          letter-spacing: 0.2px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
        }

        .feels-like-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .temp-range {
          font-size: 0.9rem;
          font-weight: 700;
          opacity: 0.95;
          margin-top: 2px;
        }

        .divider {
          margin: 0 6px;
          opacity: 0.5;
        }

        .hero-bottom-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .bottom-divider {
          border: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          width: 100%;
        }

        .bottom-summary {
          font-size: 0.82rem;
          font-weight: 500;
          line-height: 1.4;
          opacity: 0.9;
        }

        .bottom-widgets-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          margin-top: 4px;
        }

        .bottom-widget-col {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .widget-icon {
          font-size: 1.8rem;
          color: var(--accent-color);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .widget-info {
          display: flex;
          flex-direction: column;
        }

        .widget-label {
          font-size: 0.6rem;
          font-weight: 700;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          line-height: 1.1;
        }

        .widget-value {
          font-size: 0.85rem;
          font-weight: 800;
        }

        @media (max-width: 480px) {
          .temp-display {
            font-size: 5rem;
          }
          .hero-bottom-section {
            gap: 10px;
          }
          .bottom-widgets-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HeroWeather;
