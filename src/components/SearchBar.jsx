import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../context/WeatherContext';
import { searchCities } from '../services/geocodingApi';
import { useDebounce } from '../hooks/useDebounce';
import { FiSearch, FiNavigation, FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';

const SearchBar = () => {
  const { 
    activeLocation, 
    selectLocation, 
    detectUserLocation, 
    favorites, 
    addFavorite, 
    removeFavorite,
    loading: weatherLoading
  } = useWeather();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef(null);

  // Sync input value with current location name initially, or leave blank when focused
  useEffect(() => {
    if (activeLocation) {
      setQuery('');
    }
  }, [activeLocation]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    const getSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      setSearching(true);
      try {
        const results = await searchCities(debouncedQuery);
        setSuggestions(results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    };

    getSuggestions();
  }, [debouncedQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle choosing a city
  const handleSelect = (city) => {
    selectLocation({
      lat: city.lat,
      lon: city.lon,
      name: city.name,
      country: city.country,
      state: city.state
    });
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Check if active location is in favorites
  const isFavorite = activeLocation ? favorites.some(
    fav => fav.lat.toFixed(4) === activeLocation.lat.toFixed(4) && fav.lon.toFixed(4) === activeLocation.lon.toFixed(4)
  ) : false;

  const activeFavObj = activeLocation ? favorites.find(
    fav => fav.lat.toFixed(4) === activeLocation.lat.toFixed(4) && fav.lon.toFixed(4) === activeLocation.lon.toFixed(4)
  ) : null;

  const handleFavoriteToggle = () => {
    if (!activeLocation) return;
    if (isFavorite && activeFavObj) {
      removeFavorite(activeFavObj.id);
    } else {
      addFavorite(activeLocation);
    }
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div className="search-input-container glass-panel">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder={activeLocation ? `${activeLocation.name}, ${activeLocation.country || ''}` : "Search city..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="search-input"
        />

        {searching && <div className="spinner-mini"></div>}

        <button 
          onClick={detectUserLocation} 
          className="gps-btn glass-panel-hover" 
          title="Locate Me (GPS)"
          disabled={weatherLoading}
        >
          <FiNavigation className="nav-gps-icon" />
        </button>

        <button 
          onClick={handleFavoriteToggle} 
          className={`favorite-toggle-btn glass-panel-hover ${isFavorite ? 'fav-active' : ''}`}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          disabled={!activeLocation}
        >
          {isFavorite ? <FaHeart className="fav-heart" /> : <FiHeart className="fav-heart" />}
        </button>
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="suggestions-dropdown glass-panel">
          {suggestions.map((city, idx) => (
            <li 
              key={`${city.lat}-${city.lon}-${idx}`} 
              onClick={() => handleSelect(city)}
              className="suggestion-item"
            >
              <span className="city-name">{city.name}</span>
              {city.state && <span className="city-state">{city.state}, </span>}
              <span className="city-country">{city.country}</span>
              <span className="city-coords">({city.lat.toFixed(2)}, {city.lon.toFixed(2)})</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && query.length >= 2 && suggestions.length === 0 && !searching && (
        <div className="suggestions-dropdown glass-panel no-results">
          No cities found
        </div>
      )}

      <style>{`
        .search-bar-wrapper {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto 15px auto;
          z-index: 50;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          padding: 4px 8px 4px 16px;
          height: 52px;
          border-radius: 26px;
          gap: 12px;
        }

        .search-icon {
          font-size: 1.25rem;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-input {
          border: none;
          background: transparent;
          color: var(--text-main);
          font-size: 1rem;
          width: 100%;
          outline: none;
        }

        .search-input::placeholder {
          color: var(--text-main);
          opacity: 0.75;
          font-weight: 500;
        }

        .gps-btn, .favorite-toggle-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--card-border);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-main);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .gps-btn:hover, .favorite-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--accent-color);
        }

        .nav-gps-icon {
          font-size: 1.05rem;
          transform: rotate(45deg);
        }

        .fav-heart {
          font-size: 1.05rem;
          transition: transform 0.2s ease;
        }

        .favorite-toggle-btn.fav-active {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .favorite-toggle-btn.fav-active:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .favorite-toggle-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          pointer-events: none;
        }

        .favorite-toggle-btn:active .fav-heart {
          transform: scale(1.3);
        }

        .suggestions-dropdown {
          position: absolute;
          top: 58px;
          left: 0;
          right: 0;
          border-radius: 16px;
          padding: 8px 0;
          max-height: 280px;
          overflow-y: auto;
          box-shadow: var(--glass-shadow);
          list-style: none;
        }

        .suggestion-item {
          padding: 12px 20px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s ease;
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }

        .suggestion-item:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .city-name {
          font-weight: 600;
          color: var(--text-main);
        }

        .city-state, .city-country {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .city-coords {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-left: auto;
          opacity: 0.6;
        }

        .no-results {
          padding: 15px 20px;
          text-align: center;
          color: var(--text-muted);
        }

        .spinner-mini {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(var(--primary-rgb), 0.2);
          border-top-color: var(--text-main);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
