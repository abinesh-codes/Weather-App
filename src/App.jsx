import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { useDeviceType } from './hooks/useDeviceType';
import MobileLayout from './components/layouts/MobileLayout';
import TabletLayout from './components/layouts/TabletLayout';
import LaptopLayout from './components/layouts/LaptopLayout';
import DesktopLayout from './components/layouts/DesktopLayout';
import Dashboard from './pages/Dashboard';
import Radar from './pages/Radar';
import SavedLocations from './pages/SavedLocations';
import GlobalWeatherEffects from './components/GlobalWeatherEffects';
import { AnimatePresence } from 'framer-motion';
import { FiWifiOff, FiX } from 'react-icons/fi';

// Child component that resides inside BrowserRouter to use useLocation
const AnimatedAppContent = () => {
  const location = useLocation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissOfflineAlert, setDismissOfflineAlert] = useState(false);
  const deviceType = useDeviceType();
  const { weatherData } = useWeather();

  // Monitor Network connection
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setDismissOfflineAlert(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
      setDismissOfflineAlert(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const renderContentWithLayout = () => {
    const routes = (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/radar" element={<Radar />} />
          <Route path="/saved-locations" element={<SavedLocations />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    );

    if (deviceType === 'mobile') {
      return <MobileLayout>{routes}</MobileLayout>;
    }
    if (deviceType === 'tablet') {
      return <TabletLayout>{routes}</TabletLayout>;
    }
    if (deviceType === 'laptop') {
      return <LaptopLayout>{routes}</LaptopLayout>;
    }
    return <DesktopLayout>{routes}</DesktopLayout>;
  };

  return (
    <div className={`app-container device-${deviceType}`}>
      {/* Full-screen weather effects background */}
      <GlobalWeatherEffects />

      {/* Network warning overlay */}
      {isOffline && !dismissOfflineAlert && (
        <div className="offline-toast glass-panel">
          <div className="offline-toast-left">
            <FiWifiOff className="wifi-off-icon animate-pulse" />
            <span>Offline Mode: displaying cached weather profiles.</span>
          </div>
          <button onClick={() => setDismissOfflineAlert(true)} className="close-toast-btn">
            <FiX />
          </button>
        </div>
      )}

      {renderContentWithLayout()}

      <style>{`
        .app-container {
          min-height: 100vh;
          width: 100%;
        }
        /* CSS reset overrides for layout styles */
        .app-container.device-mobile,
        .app-container.device-tablet,
        .app-container.device-laptop,
        .app-container.device-desktop {
          padding-left: 0 !important;
          padding-bottom: 0 !important;
        }
        
        .offline-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          border-radius: 12px;
          z-index: 200;
          background: rgba(245, 158, 11, 0.18);
          border: 1.5px solid rgba(245, 158, 11, 0.35);
          gap: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          max-width: calc(100% - 40px);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .offline-toast-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .wifi-off-icon {
          font-size: 1.15rem;
          color: var(--accent-color);
        }

        .close-toast-btn {
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }

        .close-toast-btn:hover {
          opacity: 1;
        }

        @media (min-width: 768px) {
          .offline-toast {
            top: 30px;
            right: 30px;
          }
        }
      `}</style>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <WeatherProvider>
        <AnimatedAppContent />
      </WeatherProvider>
    </BrowserRouter>
  );
};

export default App;