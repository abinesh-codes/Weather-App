import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import { FiCloudRain, FiMap, FiHeart, FiSun, FiMoon } from 'react-icons/fi';
import { IoSunnyOutline } from 'react-icons/io5';

const TabletLayout = ({ children }) => {
  const { theme, setTheme, units, setUnits } = useWeather();

  const toggleTheme = () => {
    localStorage.setItem('weather_theme_preference', 'manual');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleUnits = () => {
    setUnits(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="tablet-layout-shell">
      <header className="tablet-header glass-panel">
        <div className="tablet-logo">
          <FiCloudRain className="logo-icon animate-pulse" />
          <span className="logo-text">WeatherSphere</span>
        </div>
        
        <nav className="tablet-nav">
          <NavLink to="/" className={({ isActive }) => `tablet-nav-item ${isActive ? 'active' : ''}`} end>
            <IoSunnyOutline className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/radar" className={({ isActive }) => `tablet-nav-item ${isActive ? 'active' : ''}`}>
            <FiMap className="nav-icon" />
            <span>Radar</span>
          </NavLink>
          <NavLink to="/saved-locations" className={({ isActive }) => `tablet-nav-item ${isActive ? 'active' : ''}`}>
            <FiHeart className="nav-icon" />
            <span>Saved</span>
          </NavLink>
        </nav>

        <div className="tablet-actions">
          <button onClick={toggleUnits} className="action-btn glass-panel-hover" title="Toggle Units">
            <span>{units === 'metric' ? '°C' : '°F'}</span>
          </button>
          <button onClick={toggleTheme} className="action-btn glass-panel-hover" title="Toggle Theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
        </div>
      </header>

      <main className="tablet-main-content">
        {children}
      </main>

      <style>{`
        .tablet-layout-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
        }
        .tablet-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 30px;
          margin: 15px;
          height: 64px;
          border-radius: 16px;
        }
        .tablet-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-icon {
          font-size: 1.5rem;
          color: var(--accent-color);
        }
        .logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(90deg, var(--text-main), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .tablet-nav {
          display: flex;
          gap: 15px;
        }
        .tablet-nav-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .tablet-nav-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-main);
        }
        .tablet-nav-item.active {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--secondary-rgb), 0.1));
          border-bottom: 2px solid var(--accent-color);
          color: var(--text-main);
          font-weight: 600;
        }
        .tablet-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-color);
        }
        .tablet-main-content {
          flex-grow: 1;
          padding: 0 15px 20px 15px;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default TabletLayout;
