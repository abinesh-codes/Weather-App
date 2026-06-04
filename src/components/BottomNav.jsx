import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { FiMap, FiHeart, FiSun, FiMoon } from 'react-icons/fi';
import { IoSunnyOutline } from 'react-icons/io5';

const BottomNav = () => {
  const { theme, setTheme, units, setUnits } = useWeather();

  return (
    <nav className="mobile-bottom-nav glass-panel">
      <NavLink 
        to="/" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        end
      >
        <IoSunnyOutline className="mobile-icon" />
        <span className="mobile-label">Dashboard</span>
      </NavLink>

      <NavLink 
        to="/radar" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiMap className="mobile-icon" />
        <span className="mobile-label">Radar</span>
      </NavLink>

      <NavLink 
        to="/saved-locations" 
        className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
      >
        <FiHeart className="mobile-icon" />
        <span className="mobile-label">Saved</span>
      </NavLink>

      {/* Quick toggle unit on mobile */}
      <button 
        onClick={() => setUnits(prev => prev === 'metric' ? 'imperial' : 'metric')} 
        className="mobile-action-btn"
      >
        <span className="mobile-unit">{units === 'metric' ? '°C' : '°F'}</span>
      </button>

      {/* Quick toggle theme on mobile */}
      <button 
        onClick={() => {
          localStorage.setItem('weather_theme_preference', 'manual');
          setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
        }} 
        className="mobile-action-btn"
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>

      <style>{`
        .mobile-bottom-nav {
          display: flex;
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          height: 64px;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px;
          z-index: 100;
          border-radius: 18px;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          gap: 4px;
          flex: 1;
          height: 100%;
          transition: all 0.25s ease;
        }

        .mobile-nav-item.active {
          color: var(--accent-color);
          font-weight: 600;
        }

        .mobile-icon {
          font-size: 1.3rem;
          transition: transform 0.2s ease;
        }

        .mobile-nav-item.active .mobile-icon {
          transform: translateY(-2px) scale(1.1);
        }

        .mobile-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.15rem;
          cursor: pointer;
          flex: 0.7;
          height: 100%;
          transition: color 0.2s ease;
        }

        .mobile-action-btn:active {
          color: var(--text-main);
        }

        .mobile-unit {
          font-size: 0.85rem;
          font-weight: 700;
        }

        @media (max-width: 380px) {
          .mobile-label {
            font-size: 0.65rem;
          }
          .mobile-bottom-nav {
            padding: 0 5px;
            height: 58px;
          }
        }

        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
