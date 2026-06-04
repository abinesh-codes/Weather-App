import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeather } from '../../context/WeatherContext';
import SearchBar from '../SearchBar';
import { FiCloudRain, FiMap, FiHeart, FiSun, FiMoon, FiBell, FiUser } from 'react-icons/fi';
import { IoSunnyOutline } from 'react-icons/io5';

const DesktopLayout = ({ children }) => {
  const { theme, setTheme, units, setUnits, triggerMorningSummary, notificationPermission, requestNotificationPermission } = useWeather();

  const toggleTheme = () => {
    localStorage.setItem('weather_theme_preference', 'manual');
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleUnits = () => {
    setUnits(prev => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  return (
    <div className="desktop-layout-shell">
      <header className="desktop-header glass-panel">
        <div className="header-left">
          <FiCloudRain className="logo-icon animate-pulse" />
          <span className="logo-text">WeatherSphere</span>
        </div>

        <div className="header-center">
          <SearchBar />
        </div>

        <div className="header-right">
          <button 
            onClick={notificationPermission === 'granted' ? triggerMorningSummary : requestNotificationPermission} 
            className={`header-btn glass-panel-hover ${notificationPermission === 'granted' ? 'bell-active' : ''}`}
            title="Daily Briefing Summary"
          >
            <FiBell />
          </button>
          
          <div className="profile-btn glass-panel" title="User Profile">
            <FiUser />
          </div>
        </div>
      </header>

      <div className="desktop-body-container">
        <aside className="desktop-sidebar glass-panel">
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

          <div className="sidebar-footer">
            <button onClick={toggleUnits} className="settings-btn glass-panel-hover" title={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}>
              <span className="unit-indicator">{units === 'metric' ? '°C' : '°F'}</span>
            </button>

            <button onClick={toggleTheme} className="settings-btn glass-panel-hover" title="Toggle Theme">
              {theme === 'light' ? <FiMoon className="setting-icon" /> : <FiSun className="setting-icon" />}
            </button>
          </div>
        </aside>

        <main className="desktop-main-content">
          {children}
        </main>
      </div>

      <style>{`
        .desktop-layout-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          padding: 20px;
          gap: 20px;
        }
        
        .desktop-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 30px;
          height: 70px;
          width: 100%;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--accent-color);
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, var(--text-main), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-center {
          flex-grow: 1;
          max-width: 500px;
          margin: 0 40px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .header-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-color);
        }

        .profile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .desktop-body-container {
          display: flex;
          flex-grow: 1;
          gap: 20px;
          width: 100%;
        }

        .desktop-sidebar {
          width: 240px;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          flex-shrink: 0;
          height: calc(100vh - 130px);
          position: sticky;
          top: 110px;
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

        .sidebar-footer {
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid var(--card-border);
          padding-top: 20px;
          gap: 10px;
        }

        .settings-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
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

        .unit-indicator {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .bell-active {
          color: var(--accent-color);
          animation: swing 2s infinite ease;
        }

        .desktop-main-content {
          flex-grow: 1;
          width: calc(100% - 260px);
          height: calc(100vh - 130px);
          overflow-y: auto;
          padding-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default DesktopLayout;
