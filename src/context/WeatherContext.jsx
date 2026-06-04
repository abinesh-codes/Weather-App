import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCurrentWeather, fetchForecast, fetchAirPollution } from '../services/weatherApi';
import { reverseGeocode } from '../services/geocodingApi';
import { processHourlyForecast, processWeeklyForecast, getWeatherTheme, getBgClassName } from '../utils/weatherHelpers';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('weather_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync favorites with LocalStorage
  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // System settings
  const [units, setUnits] = useState(() => {
    return localStorage.getItem('weather_units') || 'metric';
  });

  const [activeLocation, setActiveLocation] = useState(() => {
    const saved = localStorage.getItem('weather_active_location');
    return saved ? JSON.parse(saved) : null;
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('weather_theme') || 'dark';
  });
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Sync units with LocalStorage
  useEffect(() => {
    localStorage.setItem('weather_units', units);
  }, [units]);

  // Check and Sync Theme attribute in DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('weather_theme', theme);
  }, [theme]);

  // Sync Weather Theme class on body
  useEffect(() => {
    if (weatherData?.weatherTheme) {
      const weatherBgClass = getBgClassName(weatherData.weatherTheme);
      
      // Remove any existing weather-bg-* classes
      const body = document.body;
      const classesToRemove = Array.from(body.classList).filter(c => c.startsWith('weather-bg-'));
      classesToRemove.forEach(c => body.classList.remove(c));
      
      // Add new weather-bg-* class
      body.classList.add(weatherBgClass);
    }
  }, [weatherData?.weatherTheme]);

  // Sync active location with LocalStorage
  useEffect(() => {
    if (activeLocation) {
      localStorage.setItem('weather_active_location', JSON.stringify(activeLocation));
    }
  }, [activeLocation]);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch full weather bundle for the active location
  const loadWeatherData = async (location = activeLocation) => {
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes, pollutionRes] = await Promise.all([
        fetchCurrentWeather(location.lat, location.lon, units),
        fetchForecast(location.lat, location.lon, units),
        fetchAirPollution(location.lat, location.lon)
      ]);

      const hourly = processHourlyForecast(forecastRes.list, currentRes.timezone);
      const weekly = processWeeklyForecast(forecastRes.list, currentRes.timezone);
      const weatherTheme = getWeatherTheme(currentRes.weather[0].icon);

      // Auto-theme setting based on weather state/sunset-sunrise (if not manually overridden)
      const hasManualTheme = localStorage.getItem('weather_theme_preference') === 'manual';
      const currentTime = Math.floor(Date.now() / 1000);
      const isDaytime = currentTime >= currentRes.sys.sunrise && currentTime < currentRes.sys.sunset;
      if (!hasManualTheme) {
        setTheme(isDaytime ? 'light' : 'dark');
      }

      const fullData = {
        current: currentRes,
        forecast: forecastRes,
        hourly,
        weekly,
        pollution: pollutionRes.list[0],
        weatherTheme,
        isDaytime,
        updatedAt: Date.now()
      };

      setWeatherData(fullData);
      
      // Update coordinates name if different (helps standardizing names)
      if (location.name && (!activeLocation || location.name !== activeLocation.name)) {
        setActiveLocation(location);
      }

      // Check for alerts / push notifications
      triggerWeatherNotifications(fullData, location.name);

      // Sync this fresh data inside favorites if it's already a favorite
      setFavorites(prev => prev.map(fav => {
        if (fav.lat.toFixed(4) === location.lat.toFixed(4) && fav.lon.toFixed(4) === location.lon.toFixed(4)) {
          return {
            ...fav,
            temp: Math.round(currentRes.main.temp),
            condition: currentRes.weather[0].main,
            icon: currentRes.weather[0].icon
          };
        }
        return fav;
      }));

    } catch (err) {
      console.error('Failed to load weather bundle:', err);
      setError('Could not retrieve weather details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-load when active location coordinates or units change
  useEffect(() => {
    if (activeLocation && activeLocation.lat && activeLocation.lon) {
      loadWeatherData(activeLocation);
    } else {
      setLoading(false);
    }
  }, [activeLocation?.lat, activeLocation?.lon, units]);

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return 'unsupported';
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  };

  // Trigger Local System Notification
  const triggerNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico' // fallback icon
        });
      } catch (e) {
        // Fallback for mobile browser limitations
        console.warn('Notifications not fully supported on this device:', e);
      }
    }
  };

  // Custom Weather Alert triggers
  const triggerWeatherNotifications = (data, cityName) => {
    if (Notification.permission !== 'granted') return;

    // 1. Rain warning (Probability of precipitation > 50% in next 3 hours)
    const nextHour = data.hourly[0];
    if (nextHour && nextHour.rainChance > 50) {
      triggerNotification(
        `Rain Alert - ${cityName}`,
        `Precipitation probability is ${nextHour.rainChance}% in the next hour. Don't forget your umbrella!`
      );
    }

    // 2. Severe Temp warning
    const temp = data.current.main.temp;
    if (units === 'metric' && temp >= 38) {
      triggerNotification(`Extreme Heat Warning - ${cityName}`, `Dangerous heat levels detected (${Math.round(temp)}°C). Stay hydrated!`);
    } else if (units === 'imperial' && temp >= 100) {
      triggerNotification(`Extreme Heat Warning - ${cityName}`, `Dangerous heat levels detected (${Math.round(temp)}°F). Stay hydrated!`);
    }

    // 3. Air Quality warning
    const aqi = data.pollution.main.aqi;
    if (aqi >= 4) {
      triggerNotification(
        `Poor Air Quality Warning - ${cityName}`,
        `Air Quality Index is hazardous. Consider limiting prolonged outdoor exercise.`
      );
    }
  };

  // Switch Active Location
  const selectLocation = (location) => {
    setActiveLocation({
      lat: Number(location.lat),
      lon: Number(location.lon),
      name: location.name,
      country: location.country,
      state: location.state || ''
    });
  };

  // Auto-detect location via Geolocation API
  const detectUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const reverseResults = await reverseGeocode(latitude, longitude);
          
          if (reverseResults && reverseResults.length > 0) {
            const loc = reverseResults[0];
            selectLocation({
              lat: latitude,
              lon: longitude,
              name: loc.name,
              country: loc.country,
              state: loc.state
            });
          } else {
            // Geocoding failed, but we still have coordinates
            selectLocation({
              lat: latitude,
              lon: longitude,
              name: 'Current Location',
              country: ''
            });
          }
        } catch (err) {
          console.error('Error reverse geocoding current location:', err);
          setError('Failed to resolve city name. Using GPS coordinates.');
          selectLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'GPS Location',
            country: ''
          });
        }
      },
      (geoError) => {
        console.warn('Geolocation access denied or failed:', geoError);
        setError('Location permission denied or unavailable. Please enable location on your desktop or mobile phone, or search for a city.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Automatically trigger location detection on mount if no location is saved
  useEffect(() => {
    const saved = localStorage.getItem('weather_active_location');
    if (!saved) {
      detectUserLocation();
    }
  }, []);

  // Add city to favorites
  const addFavorite = (location) => {
    if (favorites.some(fav => fav.lat.toFixed(4) === location.lat.toFixed(4) && fav.lon.toFixed(4) === location.lon.toFixed(4))) {
      return; // Already added
    }
    const newFavorite = {
      id: Date.now().toString(),
      name: location.name,
      country: location.country,
      state: location.state || '',
      lat: Number(location.lat),
      lon: Number(location.lon),
      temp: weatherData ? Math.round(weatherData.current.main.temp) : null,
      condition: weatherData ? weatherData.current.weather[0].main : '',
      icon: weatherData ? weatherData.current.weather[0].icon : ''
    };
    setFavorites(prev => [...prev, newFavorite]);
  };

  // Remove city from favorites
  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  // Morning briefing manual trigger
  const triggerMorningSummary = () => {
    if (!weatherData) return;
    const name = activeLocation.name;
    const temp = Math.round(weatherData.current.main.temp);
    const cond = weatherData.current.weather[0].description;
    const high = Math.round(weatherData.current.main.temp_max);
    
    triggerNotification(
      `Daily Briefing for ${name}`,
      `Good morning! Currently ${temp}°${units === 'metric' ? 'C' : 'F'} and ${cond}. High today will reach ${high}°.`
    );
  };

  return (
    <WeatherContext.Provider
      value={{
        activeLocation,
        weatherData,
        loading,
        error,
        theme,
        setTheme,
        units,
        setUnits,
        favorites,
        addFavorite,
        removeFavorite,
        detectUserLocation,
        selectLocation,
        requestNotificationPermission,
        notificationPermission,
        triggerMorningSummary,
        refreshWeather: () => activeLocation && loadWeatherData(activeLocation)
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
