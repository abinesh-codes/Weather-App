import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useDeviceType } from '../hooks/useDeviceType';
import SearchBar from '../components/SearchBar';
import MobileDashboard from '../components/layouts/MobileDashboard';
import TabletDashboard from '../components/layouts/TabletDashboard';
import LaptopDashboard from '../components/layouts/LaptopDashboard';
import DesktopDashboard from '../components/layouts/DesktopDashboard';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiAlertTriangle, FiNavigation } from 'react-icons/fi';

const Dashboard = () => {
  const { weatherData, loading, error, refreshWeather, detectUserLocation, activeLocation } = useWeather();
  const deviceType = useDeviceType();

  // Skeleton Loader for initial or reloading state
  const renderSkeletons = () => (
    <div className="skeleton-dashboard">
      <div className="skeleton-bar search-skeleton"></div>
      
      <div className="dashboard-grid">
        <div className="main-panel">
          <div className="skeleton-card hero-skeleton skeleton"></div>
          <div className="skeleton-card hourly-skeleton skeleton" style={{ marginTop: '20px' }}></div>
          <div className="skeleton-grid" style={{ marginTop: '20px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card metric-skeleton skeleton"></div>
            ))}
          </div>
        </div>

        <div className="side-panel">
          <div className="skeleton-card weekly-skeleton skeleton"></div>
          <div className="skeleton-card insights-skeleton skeleton" style={{ marginTop: '20px' }}></div>
        </div>
      </div>

      <style>{`
        .skeleton-dashboard {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .skeleton-bar {
          height: 52px;
          border-radius: 26px;
          background: var(--card-border);
          max-width: 600px;
          margin: 0 auto 10px auto;
          width: 100%;
        }

        .skeleton-card {
          border-radius: 20px;
          background: var(--card-border);
        }

        .hero-skeleton {
          height: 380px;
          width: 100%;
        }

        .hourly-skeleton {
          height: 180px;
          width: 100%;
        }

        .weekly-skeleton {
          height: 480px;
          width: 100%;
        }

        .insights-skeleton {
          height: 250px;
          width: 100%;
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .metric-skeleton {
          height: 180px;
        }

        @media (min-width: 768px) {
          .skeleton-dashboard {
            padding: 40px;
          }
        }
      `}</style>
    </div>
  );

  if (loading && !weatherData) {
    return renderSkeletons();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="dashboard-container"
    >
      {/* Show search bar at top if no active location and on smaller devices */}
      {!activeLocation && deviceType !== 'desktop' && <SearchBar />}

      {/* Error Fallback Panel */}
      {error && activeLocation && (
        <div className="error-panel glass-panel">
          <FiAlertTriangle className="error-icon" />
          <div className="error-details">
            <h3>Weather Service Offline</h3>
            <p>{error}</p>
          </div>
          <button onClick={refreshWeather} className="retry-btn glass-panel-hover">
            <FiRefreshCw className="retry-icon" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Location Request Prompt */}
      {!activeLocation && (
        <div className="location-prompt-card glass-panel">
          <div className="location-prompt-content">
            <div className="location-icon-circle">
              <FiNavigation className="nav-gps-large-icon pulse" />
            </div>
            <h2>Enable Location Access</h2>
            <p>
              We need to know your location to show local weather conditions. Please turn on location services on your phone or desktop, or search for a city to get started.
            </p>
            <button onClick={detectUserLocation} className="enable-location-btn">
              <FiNavigation className="btn-gps-icon" />
              <span>Use Current Location</span>
            </button>
          </div>
        </div>
      )}

      {!error && weatherData && activeLocation && (
        <>
          {deviceType === 'mobile' && <MobileDashboard />}
          {deviceType === 'tablet' && <TabletDashboard />}
          {deviceType === 'laptop' && <LaptopDashboard />}
          {deviceType === 'desktop' && <DesktopDashboard />}
        </>
      )}

      <style>{`
        .dashboard-container {
          padding: 15px;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .main-panel {
          display: flex;
          flex-direction: column;
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Error boundary pane */
        .error-panel {
          display: flex;
          align-items: center;
          padding: 20px 24px;
          border-radius: 18px;
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.2);
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .error-icon {
          font-size: 2.2rem;
          color: #ef4444;
          flex-shrink: 0;
        }

        .error-details {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .error-details h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .error-details p {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .retry-btn {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid var(--card-border);
          color: var(--text-main);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: var(--accent-color);
        }

        .retry-icon {
          font-size: 0.95rem;
        }

        /* Location Request Prompt Card */
        .location-prompt-card {
          max-width: 550px;
          margin: 40px auto;
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          box-shadow: var(--glass-shadow);
        }

        .location-prompt-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .location-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(var(--accent-rgb), 0.12);
          border: 1px solid rgba(var(--accent-rgb), 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.15);
        }

        .nav-gps-large-icon {
          font-size: 2.2rem;
          color: var(--accent-color);
          transform: rotate(45deg);
        }

        .nav-gps-large-icon.pulse {
          animation: gpsPulse 2s infinite ease-in-out;
        }

        @keyframes gpsPulse {
          0% { transform: rotate(45deg) scale(0.95); opacity: 0.8; }
          50% { transform: rotate(45deg) scale(1.1); opacity: 1; }
          100% { transform: rotate(45deg) scale(0.95); opacity: 0.8; }
        }

        .location-prompt-card h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .location-prompt-card p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 440px;
          font-weight: 550;
        }

        .enable-location-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          font-size: 0.9rem;
          font-weight: 700;
          padding: 12px 28px;
          border-radius: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.3);
          transition: all 0.3s ease;
        }

        .enable-location-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(var(--accent-rgb), 0.45);
        }

        .btn-gps-icon {
          font-size: 1.05rem;
          transform: rotate(45deg);
        }

        @media (max-width: 480px) {
          .location-prompt-card {
            padding: 24px 16px;
            margin: 20px auto;
          }
          .location-prompt-card h2 {
            font-size: 1.3rem;
          }
          .location-prompt-card p {
            font-size: 0.88rem;
          }
          .enable-location-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (min-width: 768px) {
          .dashboard-container {
            padding: 30px;
          }
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 20px;
            padding: 0;
          }
          .side-panel {
            min-width: 340px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
