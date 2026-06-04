import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMapPin, FiHeart } from 'react-icons/fi';
import { 
  WiDaySunny, WiNightClear, WiDayCloudy, WiNightAltCloudy, 
  WiCloud, WiCloudy, WiRain, WiShowers, WiThunderstorm, 
  WiSnow, WiFog 
} from 'react-icons/wi';

const SavedLocations = () => {
  const { favorites, removeFavorite, selectLocation, units } = useWeather();
  const navigate = useNavigate();

  // Mapped icons helper
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

  const handleCityClick = (fav) => {
    selectLocation(fav);
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="saved-locations-container"
    >
      <div className="saved-header">
        <h2>Saved Cities</h2>
        <p>Keep track of weather patterns in your favorite destinations and switch between them instantly.</p>
      </div>

      <AnimatePresence mode="popLayout">
        {favorites.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="empty-favorites glass-panel"
          >
            <FiHeart className="empty-heart-icon" />
            <h3>No Cities Saved Yet</h3>
            <p>Search for any city on the dashboard and click the heart icon to save it here.</p>
            <button onClick={() => navigate('/')} className="return-btn glass-panel-hover">
              Go to Search
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
            className="favorites-grid"
          >
            {favorites.map((fav) => {
              const FavIcon = getFavIcon(fav.icon);
              return (
                <motion.div
                  key={fav.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 }
                  }}
                  layout
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  className="favorite-card glass-panel glass-panel-hover"
                >
                  <div className="fav-card-content" onClick={() => handleCityClick(fav)}>
                    <div className="fav-location-info">
                      <div className="fav-city-title">
                        <FiMapPin className="fav-pin" />
                        <span>{fav.name}</span>
                      </div>
                      <span className="fav-state-lbl">
                        {fav.state ? `${fav.state}, ` : ''}{fav.country}
                      </span>
                    </div>

                    <div className="fav-weather-info">
                      {fav.temp !== null && (
                        <div className="fav-temp-col">
                          <span className="fav-temp-value">{fav.temp}°{units === 'metric' ? 'C' : 'F'}</span>
                          <span className="fav-cond-label">{fav.condition}</span>
                        </div>
                      )}
                      <div className="fav-icon-box">
                        <FavIcon className="fav-svg-icon" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav.id);
                    }} 
                    className="fav-delete-btn"
                    title="Remove from Saved"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .saved-locations-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          min-height: calc(100vh - 100px);
          width: 100%;
        }

        .saved-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .saved-header p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }

        /* Empty states */
        .empty-favorites {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 50px 30px;
          max-width: 500px;
          margin: 40px auto;
          gap: 12px;
          border-radius: 20px;
        }

        .empty-heart-icon {
          font-size: 3.5rem;
          color: var(--text-muted);
          opacity: 0.3;
          margin-bottom: 8px;
        }

        .empty-favorites h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .empty-favorites p {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.45;
          font-weight: 500;
        }

        .return-btn {
          background: var(--accent-color);
          color: white;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 20px;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(var(--accent-rgb), 0.25);
        }

        .return-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(var(--accent-rgb), 0.35);
        }

        /* Favorites Grid */
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          width: 100%;
        }

        .favorite-card {
          position: relative;
          cursor: pointer;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .fav-card-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
          height: 100%;
          width: 100%;
        }

        .fav-location-info {
          display: flex;
          flex-direction: column;
        }

        .fav-city-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.2rem;
          font-weight: 750;
          color: var(--text-main);
        }

        .fav-pin {
          color: var(--accent-color);
          font-size: 1.05rem;
        }

        .fav-state-lbl {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 2px;
          margin-left: 18px;
          font-weight: 600;
        }

        .fav-weather-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1.5px solid var(--card-border);
          padding-top: 14px;
        }

        .fav-temp-col {
          display: flex;
          flex-direction: column;
        }

        .fav-temp-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1;
        }

        .fav-cond-label {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-top: 4px;
        }

        .fav-icon-box {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--card-border);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fav-svg-icon {
          font-size: 2.5rem;
          color: var(--text-main);
        }

        .fav-delete-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.05rem;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.25s ease;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fav-delete-btn:hover {
          opacity: 1;
          color: #ef4444;
          transform: scale(1.15);
        }

        @media (max-width: 480px) {
          .saved-locations-container {
            padding: 16px 12px;
          }
          .empty-favorites {
            padding: 30px 16px;
            margin: 20px auto;
          }
        }

        @media (min-width: 768px) {
          .saved-locations-container {
            padding: 40px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default SavedLocations;
