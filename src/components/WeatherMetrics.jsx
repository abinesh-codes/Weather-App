import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  formatTemp, formatWindSpeed, getWindDirection, 
  formatTime, getAQIDetails, getUVDetails, 
  getMoonPhase, calculateDewPoint, getDewPointComfortLevel 
} from '../utils/formatters';
import { motion } from 'framer-motion';
import { 
  FiWind, FiDroplet, FiSun, FiCompass, 
  FiEye, FiActivity, FiNavigation, FiCloudDrizzle 
} from 'react-icons/fi';
import { IoMoonOutline } from 'react-icons/io5';

const WeatherMetrics = () => {
  const { weatherData, units } = useWeather();

  const current = weatherData?.current;
  const pollution = weatherData?.pollution;

  // 1. Sunrise & Sunset Calculations
  const sunPathData = useMemo(() => {
    if (!current) return null;
    const sunrise = current.sys.sunrise;
    const sunset = current.sys.sunset;
    const now = Math.floor(Date.now() / 1000);
    const timezoneOffset = current.timezone;

    const totalDaylight = sunset - sunrise;
    const elapsedDaylight = now - sunrise;
    
    // Percentage along the sun curve (0 to 100)
    let percent = 0;
    if (now > sunrise && now < sunset) {
      percent = (elapsedDaylight / totalDaylight) * 100;
    } else if (now >= sunset) {
      percent = 100;
    }

    const isDay = now >= sunrise && now < sunset;
    const remainingDaylightMinutes = isDay 
      ? Math.max(0, Math.round((sunset - now) / 60)) 
      : 0;

    return {
      sunriseStr: formatTime(sunrise, timezoneOffset, true),
      sunsetStr: formatTime(sunset, timezoneOffset, true),
      percent,
      isDay,
      remainingDaylightMinutes
    };
  }, [current]);

  // 2. Moon Phase SVG Masking Calculations
  const moonData = useMemo(() => {
    return getMoonPhase(new Date());
  }, [current]);

  // 3. Pressure Trend Check
  const pressureTrend = useMemo(() => {
    if (!weatherData || !current) return 'stable';
    // Compare current pressure against 3 hours from now forecast
    const nextForecast = weatherData.forecast?.list?.[0];
    if (!nextForecast) return 'stable';
    
    const diff = current.main.pressure - nextForecast.main.pressure;
    if (diff > 1.5) return 'falling';
    if (diff < -1.5) return 'rising';
    return 'stable';
  }, [weatherData, current]);

  // 4. Precipitation Details
  const precipitationData = useMemo(() => {
    if (!current) return '0 mm';
    const rain = current.rain?.['1h'] || current.rain?.['3h'] || 0;
    const snow = current.snow?.['1h'] || current.snow?.['3h'] || 0;
    const total = rain + snow;
    return `${total} mm`;
  }, [current]);

  if (!weatherData || !current) return null;

  const aqi = pollution?.main?.aqi || 1;
  const aqiInfo = getAQIDetails(aqi);

  // Approximate UV Index from clouds and weather conditions
  // (OWM standard API doesn't bundle UV, OneCall does. We approximate it for the UI)
  const uvIndex = useMemo(() => {
    const isNight = !sunPathData?.isDay;
    if (isNight) return 0;

    const clouds = current.clouds.all; // 0 to 100
    const mainCondition = current.weather[0].main;
    
    let baseUv = 8; // Bright clear summer day default
    if (mainCondition === 'Rain' || mainCondition === 'Thunderstorm') baseUv = 1.5;
    else if (mainCondition === 'Clouds') baseUv = 4.5;
    
    // Attenuate by cloud cover
    const uv = baseUv * (1 - (clouds / 100) * 0.6);
    return Math.round(uv * 10) / 10;
  }, [current, sunPathData]);

  const uvInfo = getUVDetails(uvIndex);
  const dewPoint = calculateDewPoint(current.main.temp, current.main.humidity);

  return (
    <div className="metrics-grid">
      {/* 1. Air Quality Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiActivity className="metric-icon" />
          <span>Air Quality Index</span>
        </div>
        <div className="metric-body aqi-body">
          <div className="aqi-score" style={{ color: aqiInfo.color }}>
            {aqi} - {aqiInfo.label}
          </div>
          {/* Slider bar */}
          <div className="aqi-slider">
            <div className="aqi-track"></div>
            <div className="aqi-thumb" style={{ left: `${(aqi - 1) * 25}%`, backgroundColor: aqiInfo.color }}></div>
          </div>
          <p className="metric-desc">{aqiInfo.recommendation}</p>
        </div>
      </motion.div>

      {/* 2. UV Index Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiSun className="metric-icon" />
          <span>UV Index</span>
        </div>
        <div className="metric-body uv-body">
          <div className="uv-score-row">
            <span className="uv-score">{uvIndex}</span>
            <span className="uv-label" style={{ color: uvInfo.color }}>{uvInfo.label}</span>
          </div>
          {/* Custom gauge scale */}
          <div className="uv-scale-bar">
            <div className="uv-filled" style={{ width: `${Math.min(100, (uvIndex / 11) * 100)}%`, backgroundColor: uvInfo.color }}></div>
          </div>
          <p className="metric-desc">{uvInfo.recommendation}</p>
        </div>
      </motion.div>

      {/* 3. Wind Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiWind className="metric-icon" />
          <span>Wind</span>
        </div>
        <div className="metric-body wind-body">
          <div className="wind-stats">
            <span className="wind-value">{formatWindSpeed(current.wind.speed, units)}</span>
            <span className="wind-direction">Dir: {getWindDirection(current.wind.deg)} ({current.wind.deg}°)</span>
          </div>
          {/* Animated Compass Visualizer */}
          <div className="compass-visualizer">
            <FiCompass className="compass-base" />
            <div className="compass-pointer-wrapper" style={{ transform: `rotate(${current.wind.deg}deg)` }}>
              <FiNavigation className="compass-pointer" />
            </div>
            <span className="compass-cardinal compass-n">N</span>
            <span className="compass-cardinal compass-e">E</span>
            <span className="compass-cardinal compass-s">S</span>
            <span className="compass-cardinal compass-w">W</span>
          </div>
        </div>
      </motion.div>

      {/* 4. Humidity Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiDroplet className="metric-icon" />
          <span>Humidity & Dew Point</span>
        </div>
        <div className="metric-body humidity-body">
          <div className="humidity-row">
            <div className="humidity-percent-wrapper">
              <span className="humidity-value">{current.main.humidity}%</span>
            </div>
            
            {/* Dew Point side panel */}
            <div className="dew-point-details">
              <div className="dp-label">Dew Point</div>
              <div className="dp-value">{formatTemp(dewPoint, 'metric')}</div>
            </div>
          </div>

          {/* Mini wave fill slider */}
          <div className="humidity-wave-track">
            <div className="humidity-wave-fill" style={{ width: `${current.main.humidity}%` }}></div>
          </div>
          
          <p className="metric-desc">{getDewPointComfortLevel(dewPoint)}</p>
        </div>
      </motion.div>

      {/* 5. Sunrise & Sunset Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiSun className="metric-icon" />
          <span>Sunrise & Sunset</span>
        </div>
        {sunPathData && (
          <div className="metric-body sunpath-body">
            {/* Parabolic sun path SVG */}
            <div className="sunpath-visualizer">
              <svg viewBox="0 0 100 40" className="sun-curve">
                {/* Dotted path */}
                <path d="M 5,35 Q 50,5 95,35" fill="none" stroke="var(--card-border)" strokeWidth="1" strokeDasharray="3,3" />
                {/* Active path */}
                <path 
                  d="M 5,35 Q 50,5 95,35" 
                  fill="none" 
                  stroke="var(--accent-color)" 
                  strokeWidth="1.5"
                  strokeDasharray="200"
                  strokeDashoffset={200 - (sunPathData.percent * 2)} 
                />
              </svg>
              {/* Floating sun node */}
              <div 
                className="sunpath-sun-node" 
                style={{
                  left: `${sunPathData.percent}%`,
                  bottom: `${Math.sin((sunPathData.percent / 100) * Math.PI) * 28 + 2}px`
                }}
              ></div>
            </div>

            <div className="sunrise-sunset-times">
              <div>
                <span className="time-lbl">Sunrise</span>
                <span className="time-val">{sunPathData.sunriseStr}</span>
              </div>
              <div>
                <span className="time-lbl">Sunset</span>
                <span className="time-val">{sunPathData.sunsetStr}</span>
              </div>
            </div>

            <p className="metric-desc text-center">
              {sunPathData.isDay 
                ? `${sunPathData.remainingDaylightMinutes} minutes of daylight remaining`
                : 'Sun is below the horizon.'}
            </p>
          </div>
        )}
      </motion.div>

      {/* 6. Moon Phase Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <IoMoonOutline className="metric-icon" />
          <span>Moon Phase</span>
        </div>
        <div className="metric-body moon-body">
          <div className="moon-row">
            <span className="moon-phase-name">{moonData.name}</span>
            <span className="moon-illumination">{moonData.illumination}% Illum.</span>
          </div>

          {/* Dynamic Moon Drawing (SVG with shadows/mask) */}
          <div className="moon-graphic-wrapper">
            <svg viewBox="0 0 100 100" className="moon-graphic">
              {/* Background dark circle */}
              <circle cx="50" cy="50" r="40" fill="#1e293b" />
              
              {/* Moon phase path overlay */}
              {moonData.index === 0 && (
                // New Moon (Empty)
                <circle cx="50" cy="50" r="40" fill="#0f172a" opacity="0.9" />
              )}
              {moonData.index === 4 && (
                // Full Moon (Full glow)
                <circle cx="50" cy="50" r="40" fill="#f8fafc" />
              )}
              {moonData.index > 0 && moonData.index < 4 && (
                // Waxing phases
                <path 
                  d={`M 50,10 A 40,40 0 0,1 50,90 A ${40 - (moonData.position * 160)},40 0 0,${moonData.position > 0.25 ? 0 : 1} 50,10`} 
                  fill="#f8fafc" 
                />
              )}
              {moonData.index > 4 && (
                // Waning phases
                <path 
                  d={`M 50,10 A 40,40 0 0,0 50,90 A ${40 - ((1 - moonData.position) * 160)},40 0 0,${moonData.position > 0.75 ? 1 : 0} 50,10`} 
                  fill="#f8fafc" 
                />
              )}
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 7. Visibility Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiEye className="metric-icon" />
          <span>Visibility</span>
        </div>
        <div className="metric-body centered-body">
          <span className="metric-main-value">
            {current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : '--'}
          </span>
          <p className="metric-desc">
            {current.visibility >= 10000 
              ? 'Excellent visual clarity. Safe driving conditions.' 
              : current.visibility >= 5000 
                ? 'Moderate haze. Visibility is slightly affected.' 
                : 'Poor visibility. Drive with high caution.'}
          </p>
        </div>
      </motion.div>

      {/* 8. Pressure Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiActivity className="metric-icon" />
          <span>Pressure</span>
        </div>
        <div className="metric-body centered-body">
          <div className="pressure-row">
            <span className="metric-main-value">{current.main.pressure} hPa</span>
            <span className={`pressure-trend-icon trend-${pressureTrend}`}>
              {pressureTrend === 'rising' ? '↑' : pressureTrend === 'falling' ? '↓' : '→'}
            </span>
          </div>
          <p className="metric-desc">
            Pressure is currently {pressureTrend}. Average sea-level pressure is 1013.25 hPa.
          </p>
        </div>
      </motion.div>

      {/* 9. Precipitation Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="metric-card glass-panel glass-panel-hover">
        <div className="metric-header">
          <FiCloudDrizzle className="metric-icon" />
          <span>Precipitation</span>
        </div>
        <div className="metric-body centered-body">
          <span className="metric-main-value">{precipitationData}</span>
          <p className="metric-desc">
            Rain or snow precipitation accumulated in the local geographic grid block over the last hour.
          </p>
        </div>
      </motion.div>

      <style>{`
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-top: 15px;
        }

        .metric-card {
          padding: 20px;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 18px;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .metric-icon {
          font-size: 1.05rem;
          color: var(--accent-color);
        }

        .metric-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-top: 14px;
        }

        .centered-body {
          align-items: center;
          text-align: center;
        }

        .metric-main-value {
          font-size: 2.1rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }

        .metric-desc {
          font-size: 0.8rem;
          line-height: 1.4;
          color: var(--text-muted);
          margin-top: 10px;
          font-weight: 500;
        }

        /* AQI Sub-styles */
        .aqi-score {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .aqi-slider {
          position: relative;
          height: 6px;
          margin: 8px 0;
        }

        .aqi-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #10b981 0%, #f59e0b 25%, #f97316 50%, #ef4444 75%, #7c3aed 100%);
        }

        .aqi-thumb {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          top: -4px;
          border: 2.5px solid white;
          transform: translateX(-50%);
          box-shadow: 0 2px 4px rgba(0,0,0,0.25);
          transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        /* UV Sub-styles */
        .uv-score-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 6px;
        }

        .uv-score {
          font-size: 2.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .uv-label {
          font-size: 1.05rem;
          font-weight: 700;
        }

        .uv-scale-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        [data-theme='light'] .uv-scale-bar {
          background: rgba(0,0,0,0.08);
        }

        .uv-filled {
          height: 100%;
          border-radius: 3px;
        }

        /* Wind Sub-styles */
        .wind-body {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }

        .wind-stats {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .wind-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .wind-direction {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .compass-visualizer {
          position: relative;
          width: 70px;
          height: 70px;
          border: 1.5px solid var(--card-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .compass-base {
          font-size: 2.2rem;
          color: var(--text-muted);
          opacity: 0.15;
        }

        .compass-pointer-wrapper {
          position: absolute;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .compass-pointer {
          font-size: 1.15rem;
          color: var(--accent-color);
          transform: rotate(45deg);
        }

        .compass-cardinal {
          position: absolute;
          font-size: 0.6rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .compass-n { top: 4px; }
        .compass-e { right: 5px; }
        .compass-s { bottom: 4px; }
        .compass-w { left: 5px; }

        /* Humidity Sub-styles */
        .humidity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .humidity-value {
          font-size: 2.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .dew-point-details {
          text-align: right;
        }

        .dp-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .dp-value {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .humidity-wave-track {
          height: 10px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 5px;
          overflow: hidden;
          position: relative;
        }

        [data-theme='light'] .humidity-wave-track {
          background: rgba(0, 0, 0, 0.06);
        }

        .humidity-wave-fill {
          background: linear-gradient(90deg, var(--secondary-rgb), var(--accent-color));
          border-radius: 5px;
          transition: width 0.5s ease;
          height: 100%;
        }

        /* Sunrise / Sunset Sub-styles */
        .sunpath-body {
          justify-content: space-between;
        }

        .sunpath-visualizer {
          position: relative;
          height: 50px;
          margin: 6px 0;
          width: 100%;
        }

        .sun-curve {
          width: 100%;
          height: 100%;
        }

        .sunpath-sun-node {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent-color);
          box-shadow: 0 0 10px var(--accent-color);
          transform: translate(-50%, 50%);
          z-index: 5;
          transition: all 0.5s ease;
        }

        .sunrise-sunset-times {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid var(--card-border);
          padding-top: 8px;
          margin-top: 6px;
        }

        .time-lbl {
          display: block;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .time-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        /* Moon Phase styles */
        .moon-body {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }

        .moon-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .moon-phase-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .moon-illumination {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .moon-graphic-wrapper {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .moon-graphic {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 8px rgba(248, 250, 252, 0.4));
        }

        /* Pressure & Trend */
        .pressure-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pressure-trend-icon {
          font-size: 1.5rem;
          font-weight: 800;
        }

        .trend-rising { color: var(--color-good); }
        .trend-falling { color: var(--color-danger); }
        .trend-stable { color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default WeatherMetrics;
