import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_ID?.trim() || '';
const BASE_URL = 'https://api.openweathermap.org/geo/1.0';

const cache = {};
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache for search queries

const getCached = (key) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCached = (key, data) => {
  cache[key] = {
    timestamp: Date.now(),
    data
  };
};

export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const cacheKey = `search_${query.trim().toLowerCase()}`;
  const cachedData = getCached(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${BASE_URL}/direct`, {
      params: {
        q: query,
        limit: 8,
        appid: API_KEY
      }
    });
    setCached(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

export const reverseGeocode = async (lat, lon) => {
  const cacheKey = `reverse_${lat}_${lon}`;
  const cachedData = getCached(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await axios.get(`${BASE_URL}/reverse`, {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY
      }
    });
    const data = response.data;
    setCached(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
};
