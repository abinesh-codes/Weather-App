import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroWeather from '../HeroWeather';
import HourlyForecast from '../HourlyForecast';
import WeeklyForecast from '../WeeklyForecast';
import WeatherMetrics from '../WeatherMetrics';
import SmartInsights from '../SmartInsights';
import Alerts from '../Alerts';
import SearchBar from '../SearchBar';
import { FiMap } from 'react-icons/fi';

const MobileDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-dashboard">
      <SearchBar />
      <Alerts />
      <HeroWeather />
      
      <div className="section-card-mobile">
        <h3 className="section-title">Hourly Forecast</h3>
        <HourlyForecast />
      </div>

      <div className="section-card-mobile">
        <h3 className="section-title">Weekly Forecast</h3>
        <WeeklyForecast />
      </div>

      <div className="section-card-mobile">
        <h3 className="section-title">Weather Metrics</h3>
        <div className="mobile-metrics-wrapper">
          <WeatherMetrics />
        </div>
      </div>

      <div className="section-card-mobile">
        <h3 className="section-title">Smart Weather Insights</h3>
        <SmartInsights />
      </div>

      <button onClick={() => navigate('/radar')} className="mobile-radar-btn glass-panel glass-panel-hover">
        <FiMap className="radar-btn-icon" />
        <span>Open Interactive Radar Map</span>
      </button>

      <style>{`
        .mobile-dashboard {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px;
        }
        .section-card-mobile {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .section-title {
          font-size: 1.05rem;
          font-weight: 750;
          color: var(--text-main);
          margin-left: 8px;
        }
        .mobile-metrics-wrapper .metrics-grid {
          grid-template-columns: 1fr !important;
        }
        .mobile-radar-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border-radius: 18px;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-main);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          cursor: pointer;
          min-height: 48px;
        }
        .radar-btn-icon {
          font-size: 1.25rem;
          color: var(--accent-color);
        }
      `}</style>
    </div>
  );
};

export default MobileDashboard;
