import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_ID?.trim() || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// In-Memory cache dictionary
const cache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCachedData = (key) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache[key] = {
    timestamp: Date.now(),
    data
  };
};

export const fetchCurrentWeather = async (lat, lon, units = 'metric') => {
  const cacheKey = `current_${lat}_${lon}_${units}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    });
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const fetchForecast = async (lat, lon, units = 'metric') => {
  const cacheKey = `forecast_${lat}_${lon}_${units}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units
      }
    });
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

export const fetchAirPollution = async (lat, lon) => {
  const cacheKey = `pollution_${lat}_${lon}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching air pollution data:', error);
    throw error;
  }
};
