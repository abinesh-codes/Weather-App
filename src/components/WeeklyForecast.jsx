import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { formatDay, formatTemp } from '../utils/formatters';
import { motion } from 'framer-motion';
import { FiDroplet } from 'react-icons/fi';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog 
} from 'react-icons/wi';

const WeeklyForecast = () => {
  const { weatherData, units } = useWeather();
  const weeklyList = weatherData?.weekly || [];
  const timezoneOffset = weatherData?.current?.timezone || 0;

  // Icon mapping helper
  const getWeeklyIcon = (iconCode) => {
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

  // Find absolute extremes for the week to calibrate the range bars
  const weekExtremes = useMemo(() => {
    if (weeklyList.length === 0) return { min: 0, max: 100 };
    const mins = weeklyList.map(d => d.minTemp);
    const maxs = weeklyList.map(d => d.maxTemp);
    return {
      min: Math.min(...mins),
      max: Math.max(...maxs)
    };
  }, [weeklyList]);

  if (weeklyList.length === 0) return null;

  return (
    <div className="weekly-forecast-container glass-panel">
      <h3 className="section-title">7-Day Forecast</h3>

      <div className="weekly-list">
        {weeklyList.map((day, index) => {
          const DayIcon = getWeeklyIcon(day.icon);
          const isToday = index === 0;
          const dayName = isToday ? 'Today' : formatDay(day.dt, timezoneOffset, false);

          // Calculate temperature range bar percentages
          const rangeSpan = weekExtremes.max - weekExtremes.min;
          const leftPercent = rangeSpan > 0 
            ? ((day.minTemp - weekExtremes.min) / rangeSpan) * 100 
            : 0;
          const rightPercent = rangeSpan > 0 
            ? ((day.maxTemp - weekExtremes.min) / rangeSpan) * 100 
            : 100;
          const widthPercent = rightPercent - leftPercent;

          return (
            <motion.div
              key={day.dt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="weekly-row glass-panel-hover"
            >
              <div className="day-name-col">
                <span className="day-label">{dayName}</span>
                {day.isProjected && <span className="projected-tag" title="Projected forecast extension">Est</span>}
              </div>

              <div className="condition-col">
                <div className="row-icon-wrapper">
                  <DayIcon className="row-weather-icon" />
                </div>
                {day.rainChance > 15 ? (
                  <div className="row-rain-prob">
                    <FiDroplet className="rain-prob-icon" />
                    <span>{day.rainChance}%</span>
                  </div>
                ) : (
                  <div className="row-rain-prob dry-condition">
                    <span>0%</span>
                  </div>
                )}
              </div>

              <div className="temp-range-col">
                <span className="min-temp-label">{Math.round(day.minTemp)}°</span>
                
                {/* Custom Apple-style Range Slider Bar */}
                <div className="range-slider-bar">
                  <div 
                    className="slider-filled-track"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  ></div>
                </div>
                
                <span className="max-temp-label">{Math.round(day.maxTemp)}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .weekly-forecast-container {
          padding: 24px;
          width: 100%;
        }

        .weekly-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .weekly-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.03);
          gap: 10px;
        }

        .day-name-col {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1.2;
        }

        .day-label {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .projected-tag {
          font-size: 0.65rem;
          background: rgba(var(--accent-rgb), 0.15);
          color: var(--accent-color);
          padding: 2px 6px;
          border-radius: 8px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .condition-col {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .row-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .row-weather-icon {
          font-size: 2.2rem;
          color: var(--text-main);
        }

        .row-rain-prob {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent-color);
        }

        .row-rain-prob.dry-condition {
          color: var(--text-muted);
          opacity: 0.4;
        }

        .rain-prob-icon {
          font-size: 0.7rem;
        }

        .temp-range-col {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 2;
          justify-content: flex-end;
        }

        .min-temp-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          width: 25px;
          text-align: right;
        }

        .max-temp-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          width: 25px;
          text-align: right;
        }

        /* Apple-Style Range Slider Bar style */
        .range-slider-bar {
          position: relative;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          flex-grow: 1;
          overflow: hidden;
        }

        [data-theme='light'] .range-slider-bar {
          background: rgba(0, 0, 0, 0.08);
        }

        .slider-filled-track {
          position: absolute;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--accent-color), #f43f5e);
          box-shadow: 0 0 4px var(--glow-color);
        }

        @media (max-width: 480px) {
          .weekly-forecast-container {
            padding: 16px 12px;
          }
          .weekly-row {
            padding: 10px 8px;
            gap: 6px;
          }
          .day-name-col {
            flex: 1;
          }
          .day-label {
            font-size: 0.85rem;
          }
          .condition-col {
            flex: 0.8;
            gap: 4px;
          }
          .row-weather-icon {
            font-size: 1.8rem;
          }
          .temp-range-col {
            flex: 1.8;
            gap: 6px;
          }
          .min-temp-label, .max-temp-label {
            font-size: 0.8rem;
            width: 22px;
          }
          .range-slider-bar {
            height: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default WeeklyForecast;
