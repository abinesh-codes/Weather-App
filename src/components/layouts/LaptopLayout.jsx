import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import { FiCloudRain, FiMap, FiHeart, FiSun, FiMoon, FiBell } from 'react-icons/fi';
import { IoSunnyOutline } from 'react-icons/io5';

const LaptopLayout = ({ children }) => {
  const { theme, setTheme, units, setUnits, triggerMorningSummary, notificationPermission, requestNotificationPermission } = useWeather();

  const toggleTheme = () => {
    localStorage.setItem('weather_theme_preference', 'manual');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleUnits = () => {
    setUnits(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="laptop-layout-shell">
      <aside className="laptop-sidebar glass-panel">
        <div className="logo-container">
          <FiCloudRain className="logo-icon animate-pulse" />
          <span className="logo-text">SkyPulse</span>
        </div>

        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
            <IoSunnyOutline className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/radar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiMap className="nav-icon" />
            <span>Radar</span>
          </NavLink>
          <NavLink to="/saved-locations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiHeart className="nav-icon" />
            <span>Saved Cities</span>
          </NavLink>
        </nav>

        <div className="nav-settings">
          <button onClick={toggleUnits} className="settings-btn glass-panel-hover" title={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}>
            <span className="unit-indicator">{units === 'metric' ? '°C' : '°F'}</span>
          </button>

          <button 
            onClick={notificationPermission === 'granted' ? triggerMorningSummary : requestNotificationPermission} 
            className={`settings-btn glass-panel-hover ${notificationPermission === 'granted' ? 'bell-active' : ''}`}
            title="Daily Briefing Summary"
          >
            <FiBell className="setting-icon" />
          </button>

          <button onClick={toggleTheme} className="settings-btn glass-panel-hover" title="Toggle Theme">
            {theme === 'light' ? <FiMoon className="setting-icon" /> : <FiSun className="setting-icon" />}
          </button>
        </div>
      </aside>

      <main className="laptop-main-content">
        {children}
      </main>

      <style>{`
        .laptop-layout-shell {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }
        .laptop-sidebar {
          position: fixed;
          left: 20px;
          top: 20px;
          bottom: 20px;
          width: 220px;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          z-index: 100;
        }
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 50px;
        }
        .logo-icon {
          font-size: 1.8rem;
          color: var(--accent-color);
        }
        .logo-text {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, var(--text-main), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 15px;
          flex-grow: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 20px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }
        .nav-item.active {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.25), rgba(var(--secondary-rgb), 0.15));
          border-left: 4px solid var(--accent-color);
          color: var(--text-main);
          font-weight: 600;
          box-shadow: inset 0 0 10px rgba(var(--primary-rgb), 0.15);
        }
        .nav-icon {
          font-size: 1.25rem;
        }
        .nav-settings {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--card-border);
          padding-top: 20px;
          gap: 10px;
        }
        .settings-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-color);
        }
        .setting-icon {
          font-size: 1.1rem;
        }
        .unit-indicator {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .bell-active {
          color: var(--accent-color);
          animation: swing 2s infinite ease;
        }
        @keyframes swing {
          0%, 100% { transform: rotate(0); }
          10%, 30% { transform: rotate(10deg); }
          20%, 40% { transform: rotate(-10deg); }
          50% { transform: rotate(0); }
        }
        .laptop-main-content {
          flex-grow: 1;
          padding: 20px 20px 20px 260px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default LaptopLayout;
