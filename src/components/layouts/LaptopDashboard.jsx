import React from 'react';
import HeroWeather from '../HeroWeather';
import HourlyForecast from '../HourlyForecast';
import WeeklyForecast from '../WeeklyForecast';
import WeatherMetrics from '../WeatherMetrics';
import SmartInsights from '../SmartInsights';
import Alerts from '../Alerts';
import WeatherRadar from '../WeatherRadar';
import SearchBar from '../SearchBar';
import { useWeather } from '../../context/WeatherContext';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog 
} from 'react-icons/wi';

const LaptopDashboard = () => {
  const { activeLocation, weatherData } = useWeather();

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
    <div className="laptop-dashboard">
      <SearchBar />
      <Alerts />

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

      <div className="laptop-top-row">
        <div className="laptop-hero-col">
          <HeroWeather />
        </div>
        <div className="laptop-metrics-col">
          <h3 className="section-title-laptop">Weather Metrics</h3>
          <div className="laptop-metrics-wrapper">
            <WeatherMetrics />
          </div>
        </div>
      </div>

      <div className="laptop-forecast-card glass-panel">
        <h3 className="panel-title-laptop">Hourly Forecast</h3>
        <HourlyForecast />
      </div>

      <div className="laptop-forecast-card glass-panel">
        <h3 className="panel-title-laptop">Weekly Forecast</h3>
        <WeeklyForecast />
      </div>

      <div className="laptop-bottom-row">
        <div className="bottom-widget glass-panel">
          <h3 className="panel-title-laptop">Live Weather Radar</h3>
          <div className="radar-widget-box">
            <WeatherRadar />
          </div>
        </div>
        <div className="bottom-widget glass-panel">
          <h3 className="panel-title-laptop">Smart Weather Insights</h3>
          <div className="insights-widget-box">
            <SmartInsights />
          </div>
        </div>
      </div>

      <style>{`
        .laptop-dashboard {
          display: flex;
          flex-direction: column;
          gap: 25px;
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

        .laptop-top-row {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 20px;
          align-items: stretch;
        }

        .laptop-hero-col {
          display: flex;
          flex-direction: column;
        }

        .laptop-hero-col > div {
          height: 100%;
        }

        .section-title-laptop {
          font-size: 1.1rem;
          font-weight: 750;
          color: var(--text-main);
          margin-bottom: 12px;
          margin-left: 5px;
        }

        .laptop-metrics-wrapper .metrics-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }

        .laptop-forecast-card {
          padding: 24px;
        }

        .panel-title-laptop {
          font-size: 1.1rem;
          font-weight: 750;
          color: var(--text-main);
          margin-bottom: 15px;
        }

        .laptop-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .bottom-widget {
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .radar-widget-box {
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .insights-widget-box {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

export default LaptopDashboard;
