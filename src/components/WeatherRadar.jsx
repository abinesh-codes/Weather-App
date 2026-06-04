import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useWeather } from '../context/WeatherContext';
import { FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

const API_KEY = import.meta.env.VITE_APP_ID?.trim() || '';

// Component to dynamically recenter the map on coordinates change
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const WeatherRadar = () => {
  const { activeLocation, detectUserLocation } = useWeather();
  const [activeLayer, setActiveLayer] = useState('precipitation_new'); // clouds_new, temp_new, wind_new, precipitation_new
  
  if (!activeLocation) {
    return (
      <div className="radar-map-wrapper glass-panel location-required-radar">
        <div className="radar-required-content">
          <FiNavigation className="nav-gps-large-icon pulse" />
          <h3>Location Access Required</h3>
          <p>
            Please turn on location services on your phone or desktop, or search for a city to view the live radar maps.
          </p>
          <button onClick={detectUserLocation} className="radar-enable-location-btn">
            <FiNavigation className="btn-gps-icon" />
            <span>Use Current Location</span>
          </button>
        </div>
        <style>{`
          .location-required-radar {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 480px;
            padding: 40px;
          }
          .radar-required-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            text-align: center;
          }
          .radar-required-content h3 {
            font-size: 1.35rem;
            font-weight: 750;
            color: var(--text-main);
          }
          .radar-required-content p {
            font-size: 0.88rem;
            color: var(--text-muted);
            max-width: 320px;
            line-height: 1.5;
            font-weight: 550;
          }
          .radar-enable-location-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            font-size: 0.82rem;
            font-weight: 700;
            padding: 10px 22px;
            border-radius: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.2);
            transition: all 0.3s ease;
          }
          .radar-enable-location-btn:hover {
            transform: translateY(-1.5px);
            box-shadow: 0 6px 16px rgba(var(--accent-rgb), 0.35);
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
          .btn-gps-icon {
            font-size: 0.95rem;
            transform: rotate(45deg);
          }
        `}</style>
      </div>
    );
  }

  const mapCenter = [activeLocation.lat, activeLocation.lon];

  const layers = [
    { id: 'precipitation_new', label: 'Rain Radar', legend: 'Green (light) to Red (heavy rain)' },
    { id: 'clouds_new', label: 'Cloud Cover', legend: 'Grey opacity (0% to 100% clouds)' },
    { id: 'temp_new', label: 'Temperature Map', legend: 'Blue (cold) to Red (hot)' },
    { id: 'wind_new', label: 'Wind Speed', legend: 'Green (breeze) to Violet (gale)' }
  ];

  return (
    <div className="radar-map-wrapper glass-panel">
      <div className="radar-controls">
        <h3 className="radar-title">Interactive Weather Map</h3>
        <div className="radar-buttons">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`radar-layer-btn glass-panel-hover ${activeLayer === layer.id ? 'active-layer' : ''}`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-frame">
        <MapContainer 
          center={mapCenter} 
          zoom={5} 
          scrollWheelZoom={true} 
          zoomControl={true}
        >
          {/* Base Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* OpenWeatherMap Weather Overlay Layer */}
          {API_KEY && (
            <TileLayer
              key={activeLayer}
              url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`}
              opacity={0.65}
            />
          )}

          <RecenterMap center={mapCenter} />
        </MapContainer>
      </div>

      <div className="radar-legend-bar">
        <span className="legend-label">Layer Range:</span>
        <span className="legend-desc">{layers.find(l => l.id === activeLayer)?.legend}</span>
      </div>

      <style>{`
        .radar-map-wrapper {
          display: flex;
          flex-direction: column;
          padding: 20px;
          height: 100%;
          min-height: 480px;
          gap: 16px;
        }

        .radar-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .radar-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .radar-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .radar-layer-btn {
          border: 1px solid var(--card-border);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .radar-layer-btn.active-layer {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.25);
        }

        .map-frame {
          flex-grow: 1;
          height: 420px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--card-border);
          box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }

        .radar-legend-bar {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 0.78rem;
          color: var(--text-muted);
          border-top: 1px solid var(--card-border);
          padding-top: 12px;
          font-weight: 600;
        }

        .legend-label {
          color: var(--accent-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 480px) {
          .radar-map-wrapper {
            padding: 12px;
            min-height: 400px;
          }
          .map-frame {
            height: 320px;
          }
          .radar-layer-btn {
            font-size: 0.75rem;
            padding: 6px 10px;
          }
          .radar-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherRadar;
