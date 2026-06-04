import React from 'react';
import HeroWeather from '../HeroWeather';
import HourlyForecast from '../HourlyForecast';
import WeeklyForecast from '../WeeklyForecast';
import WeatherMetrics from '../WeatherMetrics';
import SmartInsights from '../SmartInsights';
import Alerts from '../Alerts';
import WeatherRadar from '../WeatherRadar';
import SearchBar from '../SearchBar';

const TabletDashboard = () => {
  return (
    <div className="tablet-dashboard">
      <SearchBar />
      <Alerts />
      <HeroWeather />

      <div className="tablet-forecasts-row">
        <div className="forecast-panel-tablet glass-panel">
          <h3 className="panel-title-tablet">Hourly Forecast</h3>
          <HourlyForecast />
        </div>
        <div className="forecast-panel-tablet glass-panel">
          <h3 className="panel-title-tablet">Weekly Forecast</h3>
          <WeeklyForecast />
        </div>
      </div>

      <div className="tablet-metrics-radar-grid">
        <div className="tablet-metrics-col">
          <h3 className="section-title-tablet">Weather Metrics</h3>
          <div className="tablet-metrics-wrapper">
            <WeatherMetrics />
          </div>
        </div>
        
        <div className="tablet-radar-widget-col">
          <h3 className="section-title-tablet">Live Weather Radar</h3>
          <div className="tablet-radar-widget glass-panel">
            <WeatherRadar />
          </div>
          <div className="tablet-insights-box" style={{ marginTop: '20px' }}>
            <h3 className="section-title-tablet">Smart Insights</h3>
            <SmartInsights />
          </div>
        </div>
      </div>

      <style>{`
        .tablet-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tablet-forecasts-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .forecast-panel-tablet {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .panel-title-tablet {
          font-size: 1.1rem;
          font-weight: 750;
          color: var(--text-main);
        }

        .section-title-tablet {
          font-size: 1.1rem;
          font-weight: 750;
          color: var(--text-main);
          margin-bottom: 12px;
          margin-left: 5px;
        }

        .tablet-metrics-radar-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .tablet-metrics-wrapper .metrics-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }

        .tablet-radar-widget {
          height: 300px;
          overflow: hidden;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default TabletDashboard;
