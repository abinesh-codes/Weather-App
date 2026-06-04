import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatTime, formatTemp } from '../utils/formatters';
import { motion } from 'framer-motion';
import { FiDroplet } from 'react-icons/fi';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog 
} from 'react-icons/wi';

const HourlyForecast = () => {
  const { weatherData, units } = useWeather();
  const hourlyList = weatherData?.hourly || [];
  const timezoneOffset = weatherData?.current?.timezone || 0;

  // Icon mapping helper
  const getHourlyIcon = (iconCode) => {
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
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  if (hourlyList.length === 0) return null;

  return (
    <div className="hourly-forecast-container glass-panel">
      <h3 className="section-title">24-Hour Forecast</h3>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hourly-scroll-container snap-inline"
      >
        {hourlyList.map((hour, index) => {
          const HourlyIcon = getHourlyIcon(hour.icon);
          const isNow = index === 0;
          const displayTime = isNow ? 'Now' : formatTime(hour.timeEpoch, timezoneOffset, true);

          return (
            <motion.div
              key={hour.timeEpoch}
              variants={itemVariants}
              className={`hourly-card glass-panel-hover ${isNow ? 'active-hour' : ''}`}
            >
              <span className="hour-time">{displayTime}</span>
              
              <div className="hour-icon-wrapper">
                <HourlyIcon className="hour-weather-icon" />
              </div>
              
              <span className="hour-temp">{formatTemp(hour.temp, units)}</span>
              
              <div className="hour-rain">
                <FiDroplet className="rain-icon" />
                <span>{hour.rainChance}%</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <style>{`
        .hourly-forecast-container {
          padding: 24px;
          overflow: hidden;
          width: 100%;
        }

        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
          letter-spacing: 0.3px;
        }

        .hourly-scroll-container {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 10px;
          width: 100%;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }

        .hourly-card {
          flex: 0 0 90px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 12px;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.04);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .hourly-card.active-hour {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--secondary-rgb), 0.1));
          border-color: var(--accent-color);
          box-shadow: 0 4px 15px var(--glow-color);
        }

        .hour-time {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .hourly-card.active-hour .hour-time {
          color: var(--accent-color);
        }

        .hour-icon-wrapper {
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hour-weather-icon {
          font-size: 2.8rem;
          color: var(--text-main);
        }

        .hourly-card.active-hour .hour-weather-icon {
          filter: drop-shadow(0 0 8px var(--glow-color));
        }

        .hour-temp {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .hour-rain {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent-color);
          margin-top: 6px;
          opacity: 0.85;
        }

        .rain-icon {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default HourlyForecast;
