import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import HeroWeather from '../HeroWeather';
import HourlyForecast from '../HourlyForecast';
import WeeklyForecast from '../WeeklyForecast';
import WeatherMetrics from '../WeatherMetrics';
import SmartInsights from '../SmartInsights';
import Alerts from '../Alerts';
import WeatherRadar from '../WeatherRadar';
import { FiMapPin, FiHeart, FiAlertOctagon } from 'react-icons/fi';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog 
} from 'react-icons/wi';

const DesktopDashboard = () => {
  const { favorites, selectLocation, activeLocation, weatherData } = useWeather();

  const getFavIcon = (iconCode) => {
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

  return (
    <div className="desktop-dashboard">
      {activeLocation && weatherData && (
        <div className="dashboard-location-header">
          <div className="location-title-block">
            <h1 className="location-name-main">{activeLocation.name}</h1>
            <span className="location-details-main">
              {activeLocation.state ? `${activeLocation.state}, ` : ''}{activeLocation.country}
            </span>
          </div>
          
          <div className="location-icon-wrapper-main glass-panel">
            {(() => {
              const IconComponent = getFavIcon(weatherData.current.weather[0].icon);
              return <IconComponent className="location-icon-main" />;
            })()}
          </div>
        </div>
      )}

      {/* Column Row (Four columns) */}
      <div className="desktop-four-columns">
        {/* Column 1: Locations Panel */}
        <div className="desktop-col locations-panel glass-panel">
          <div className="panel-header">
            <FiHeart className="heart-icon-desktop" />
            <h4>Saved Locations</h4>
          </div>
          <div className="locations-list">
            {favorites.length === 0 ? (
              <div className="no-favs-msg">
                <FiMapPin className="pin-icon" />
                <p>No saved locations. Click the heart icon in search to save cities.</p>
              </div>
            ) : (
              favorites.map((fav) => {
                const FavIcon = getFavIcon(fav.icon);
                const isActive = activeLocation && activeLocation.lat.toFixed(4) === fav.lat.toFixed(4) && activeLocation.lon.toFixed(4) === fav.lon.toFixed(4);
                return (
                  <div 
                    key={fav.id} 
                    onClick={() => selectLocation(fav)} 
                    className={`fav-location-row ${isActive ? 'active-row' : ''} glass-panel-hover`}
                  >
                    <div className="fav-row-left">
                      <span className="fav-row-name">{fav.name}</span>
                      <span className="fav-row-country">{fav.country}</span>
                    </div>
                    <div className="fav-row-right">
                      {fav.temp !== null && <span className="fav-row-temp">{fav.temp}°</span>}
                      <FavIcon className="fav-row-icon" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Current Weather */}
        <div className="desktop-col current-weather-col">
          <HeroWeather />
        </div>

        {/* Column 3: Hourly Forecast */}
        <div className="desktop-col forecast-col glass-panel">
          <div className="panel-header">
            <h4>Hourly Forecast</h4>
          </div>
          <div className="panel-body">
            <HourlyForecast />
          </div>
        </div>

        {/* Column 4: Weekly Forecast */}
        <div className="desktop-col forecast-col glass-panel">
          <div className="panel-header">
            <h4>Weekly Forecast</h4>
          </div>
          <div className="panel-body">
            <WeeklyForecast />
          </div>
        </div>
      </div>

      {/* Weather Metrics (4 Columns layout is styled using metrics-grid) */}
      <div className="desktop-metrics-section">
        <h3 className="section-title-desktop">Weather Analytics</h3>
        <div className="desktop-metrics-wrapper">
          <WeatherMetrics />
        </div>
      </div>

      {/* Large Interactive Weather Radar */}
      <div className="desktop-radar-section glass-panel">
        <div className="panel-header">
          <h4>Interactive Weather Radar Map</h4>
        </div>
        <div className="desktop-radar-box">
          <WeatherRadar />
        </div>
      </div>

      {/* Bottom row: Alerts, Sunrise, Smart Insights */}
      <div className="desktop-bottom-row">
        <div className="desktop-bottom-widget alerts-widget glass-panel">
          <div className="panel-header">
            <FiAlertOctagon className="alert-hdr-icon" />
            <h4>System & Weather Alerts</h4>
          </div>
          <div className="alerts-body">
            <Alerts />
          </div>
        </div>

        <div className="desktop-bottom-widget insights-widget glass-panel">
          <div className="panel-header">
            <h4>Smart Weather Insights</h4>
          </div>
          <div className="insights-body">
            <SmartInsights />
          </div>
        </div>
      </div>

      <style>{`
        .desktop-dashboard {
          display: flex;
          flex-direction: column;
          gap: 25px;
          padding: 10px 0;
        }

        .desktop-four-columns {
          display: grid;
          grid-template-columns: 240px 1.2fr 1fr 1fr;
          gap: 20px;
          align-items: stretch;
        }

        .desktop-col {
          display: flex;
          flex-direction: column;
          height: auto;
        }

        .locations-panel {
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 10px;
        }

        .panel-header h4 {
          font-size: 0.95rem;
          font-weight: 750;
          color: var(--text-main);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .heart-icon-desktop {
          color: #ef4444;
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .no-favs-msg {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px 0;
          color: var(--text-muted);
          text-align: center;
        }

        .no-favs-msg p {
          font-size: 0.78rem;
          line-height: 1.35;
          font-weight: 550;
        }

        .pin-icon {
          font-size: 1.4rem;
          color: var(--accent-color);
        }

        .fav-location-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.3s ease;
        }

        .fav-location-row:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--card-border);
        }

        .fav-location-row.active-row {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--secondary-rgb), 0.15));
          border-color: var(--accent-color);
        }

        .fav-row-left {
          display: flex;
          flex-direction: column;
        }

        .fav-row-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .fav-row-country {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .fav-row-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .fav-row-temp {
          font-size: 0.95rem;
          font-weight: 750;
          color: var(--text-main);
        }

        .fav-row-icon {
          font-size: 1.4rem;
          color: var(--text-main);
        }

        .forecast-col {
          padding: 20px;
        }

        .forecast-col .panel-body {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section-title-desktop {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 15px;
          margin-left: 5px;
        }

        .desktop-metrics-wrapper .metrics-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }

        .desktop-radar-section {
          padding: 24px;
          width: 100%;
        }

        .desktop-radar-box {
          height: 450px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .desktop-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .desktop-bottom-widget {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .alert-hdr-icon {
          color: var(--accent-color);
        }

        .alerts-body {
          flex-grow: 1;
        }

        .dashboard-location-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 5px;
          margin-bottom: 5px;
          padding: 0 5px;
        }

        .location-title-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .location-name-main {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1.1;
        }

        .location-details-main {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .location-icon-wrapper-main {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--nav-bg);
          border: 1px solid var(--card-border);
          box-shadow: var(--glass-shadow);
        }

        .location-icon-main {
          font-size: 3.2rem;
          color: var(--accent-color);
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
      `}</style>
    </div>
  );
};

export default DesktopDashboard;
