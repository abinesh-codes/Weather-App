import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { FiAlertTriangle, FiBell, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Alerts = () => {
  const { 
    weatherData, 
    units, 
    notificationPermission, 
    requestNotificationPermission 
  } = useWeather();

  const current = weatherData?.current;
  const pollution = weatherData?.pollution;

  // Compute severe alerts based on metrics
  const activeAlerts = useMemo(() => {
    if (!current) return [];
    const temp = current.main.temp;
    const windSpeed = current.wind.speed * 3.6; // m/s to km/h
    const condCode = current.weather[0].id; // OWM weather codes
    const condition = current.weather[0].main;
    const aqi = pollution?.main?.aqi || 1;

    const list = [];

    // 1. Thunderstorms or Severe Rain
    if (condCode >= 200 && condCode <= 232) {
      list.push({
        id: 'storm',
        priority: 'danger',
        title: 'Severe Thunderstorm Warning',
        message: 'Lightning flashes, heavy rainfall, and potential local flooding. Seek indoor shelter immediately.'
      });
    } else if (condCode >= 502 && condCode <= 504) {
      list.push({
        id: 'heavy-rain',
        priority: 'danger',
        title: 'Torrential Rainfall Advisory',
        message: 'Extremely heavy rainfall active. Avoid commuting through low-lying areas.'
      });
    } else if (condition === 'Rain') {
      list.push({
        id: 'rain-alert',
        priority: 'warning',
        title: 'Wet Weather Warning',
        message: 'Steady rain is falling. Roads are slick; exercise care during outdoor travel.'
      });
    }

    // 2. Extreme Heat
    if (units === 'metric' && temp >= 38) {
      list.push({
        id: 'heat-wave',
        priority: 'danger',
        title: 'Extreme Heat Warning',
        message: `High ambient temperatures (${Math.round(temp)}°C). Limit physical activities outdoors; drink plenty of electrolytes.`
      });
    } else if (units === 'imperial' && temp >= 100) {
      list.push({
        id: 'heat-wave',
        priority: 'danger',
        title: 'Extreme Heat Warning',
        message: `High ambient temperatures (${Math.round(temp)}°F). Limit physical activities outdoors; drink plenty of electrolytes.`
      });
    }

    // 3. High Winds
    if (windSpeed >= 40) {
      list.push({
        id: 'high-wind',
        priority: 'danger',
        title: 'Severe Gale Advisory',
        message: `Damaging winds of ${Math.round(windSpeed)} km/h. Secure external items and avoid walking near scaffolding.`
      });
    } else if (windSpeed >= 25) {
      list.push({
        id: 'medium-wind',
        priority: 'warning',
        title: 'Windy Conditions',
        message: `Breezes are gusting up to ${Math.round(windSpeed)} km/h.`
      });
    }

    // 4. Air Quality
    if (aqi >= 4) {
      list.push({
        id: 'aqi-alert',
        priority: 'danger',
        title: 'Hazardous Air Quality Alert',
        message: 'Severe particulate loading. Sensitive groups must remain indoors; general public should avoid strenuous outdoor activities.'
      });
    }

    return list;
  }, [current, pollution, units]);

  if (!weatherData) return null;

  return (
    <div className="alerts-container">
      {/* Severe Weather Warnings */}
      <AnimatePresence>
        {activeAlerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`alert-banner priority-${alert.priority} glass-panel`}
          >
            <FiAlertTriangle className="alert-banner-icon" />
            <div className="alert-banner-content">
              <h4 className="alert-title">{alert.title}</h4>
              <p className="alert-message">{alert.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Browser notifications prompt if not allowed yet */}
      {notificationPermission === 'default' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="notification-promo glass-panel"
        >
          <div className="promo-left">
            <FiBell className="promo-bell-icon animate-bounce" />
            <div>
              <h4 className="promo-title">Enable Real-Time Alerts</h4>
              <p className="promo-text">Get desktop notifications for rain forecasts, extreme heat warnings, and severe weather gales.</p>
            </div>
          </div>
          <button 
            onClick={requestNotificationPermission} 
            className="promo-enable-btn glass-panel-hover"
          >
            Enable Alerts
          </button>
        </motion.div>
      )}

      <style>{`
        .alerts-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 15px;
          width: 100%;
        }

        .alert-banner {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 16px;
          align-items: flex-start;
        }

        .alert-banner.priority-danger {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .alert-banner.priority-danger .alert-banner-icon {
          color: #ef4444;
        }

        .alert-banner.priority-warning {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .alert-banner.priority-warning .alert-banner-icon {
          color: #f59e0b;
        }

        .alert-banner-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert-banner-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .alert-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .alert-message {
          font-size: 0.84rem;
          line-height: 1.4;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Notification Promo styles */
        .notification-promo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-radius: 16px;
          flex-wrap: wrap;
          gap: 16px;
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--secondary-rgb), 0.05));
          border-color: rgba(var(--primary-rgb), 0.25);
        }

        .promo-left {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;
          min-width: 250px;
        }

        .promo-bell-icon {
          font-size: 1.6rem;
          color: var(--accent-color);
          flex-shrink: 0;
        }

        .promo-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .promo-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
          line-height: 1.35;
          font-weight: 500;
        }

        .promo-enable-btn {
          background: var(--accent-color);
          color: white;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(var(--accent-rgb), 0.25);
        }

        .promo-enable-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(var(--accent-rgb), 0.35);
        }

        @media (max-width: 480px) {
          .notification-promo {
            padding: 12px 16px;
          }
          .promo-left {
            min-width: 200px;
            gap: 10px;
          }
          .promo-bell-icon {
            font-size: 1.30rem;
          }
          .promo-enable-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Alerts;
