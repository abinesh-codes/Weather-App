/**
 * Utility functions for formatting weather metrics and calculating derived properties.
 */

// Format Temperature
export const formatTemp = (temp, unit = 'metric') => {
  if (temp === undefined || temp === null) return '--°';
  const val = Math.round(temp);
  return `${val}°${unit === 'metric' ? 'C' : 'F'}`;
};

// Format Wind Speed
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (speed === undefined || speed === null) return '--';
  return unit === 'metric' 
    ? `${Math.round(speed * 3.6)} km/h`  // m/s to km/h
    : `${Math.round(speed)} mph`;
};

// Convert Wind degrees to Cardinal Direction
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
};

// Format Time
export const formatTime = (epochSeconds, timezoneOffset = 0, format12h = true) => {
  if (!epochSeconds) return '--';
  const date = new Date((epochSeconds + timezoneOffset) * 1000);
  
  // Since we want local time in target timezone, adjust for UTC offset
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (1000 * timezoneOffset));
  
  let hours = localDate.getHours();
  const minutes = localDate.getMinutes().toString().padStart(2, '0');
  
  if (format12h) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
};

// Format Day of Week
export const formatDay = (epochSeconds, timezoneOffset = 0, short = false) => {
  if (!epochSeconds) return '';
  const date = new Date((epochSeconds + timezoneOffset) * 1000);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (1000 * timezoneOffset));
  
  const options = { weekday: short ? 'short' : 'long' };
  return localDate.toLocaleDateString('en-US', options);
};

// Format Full Date
export const formatLocalDate = (epochSeconds, timezoneOffset = 0) => {
  if (!epochSeconds) return '';
  const date = new Date((epochSeconds + timezoneOffset) * 1000);
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const localDate = new Date(utc + (1000 * timezoneOffset));
  
  return localDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

// AQI mapping based on OpenWeather API level (1-5)
export const getAQIDetails = (level) => {
  const index = Math.round(level);
  switch (index) {
    case 1:
      return {
        label: 'Good',
        color: '#10b981',
        textClass: 'aqi-good',
        recommendation: 'Air quality is satisfactory, and air pollution poses little or no risk. Great day for outdoor activities!',
      };
    case 2:
      return {
        label: 'Moderate',
        color: '#f59e0b',
        textClass: 'aqi-moderate',
        recommendation: 'Air quality is acceptable. However, highly sensitive people should consider reducing prolonged outdoor exertion.',
      };
    case 3:
      return {
        label: 'Unhealthy',
        color: '#f97316',
        textClass: 'aqi-unhealthy-sens',
        recommendation: 'Members of sensitive groups may experience health effects. General public is less likely to be affected.',
      };
    case 4:
      return {
        label: 'Severe',
        color: '#ef4444',
        textClass: 'aqi-unhealthy',
        recommendation: 'Everyone may begin to experience health effects. Active children and adults should limit prolonged outdoor exertion.',
      };
    case 5:
      return {
        label: 'Hazardous',
        color: '#7c3aed',
        textClass: 'aqi-hazardous',
        recommendation: 'Health warnings of emergency conditions. The entire population is likely to be affected. Avoid all outdoor activities.',
      };
    default:
      return {
        label: 'Unknown',
        color: '#94a3b8',
        textClass: 'aqi-unknown',
        recommendation: 'No air quality details available.',
      };
  }
};

// UV Index description and recommendations
export const getUVDetails = (uv) => {
  if (uv === undefined || uv === null) {
    return { label: 'Low', recommendation: 'No protection required.' };
  }
  
  if (uv < 3) {
    return {
      label: 'Low',
      color: '#10b981',
      recommendation: 'Minimal risk. Wear sunglasses on bright days. No special sunscreen precautions needed.',
    };
  } else if (uv < 6) {
    return {
      label: 'Moderate',
      color: '#f59e0b',
      recommendation: 'Low-to-moderate risk. Apply SPF 15+ sunscreen every 2 hours. Wear a hat and stay in the shade midday.',
    };
  } else if (uv < 8) {
    return {
      label: 'High',
      color: '#f97316',
      recommendation: 'High risk of harm. Wear protective clothing, a wide-brimmed hat, sunglasses, and use SPF 30+ sunscreen.',
    };
  } else if (uv < 11) {
    return {
      label: 'Very High',
      color: '#ef4444',
      recommendation: 'Very high risk. Minimize sun exposure between 10 AM and 4 PM. Seek shade, wear protective layers and SPF 30+.',
    };
  } else {
    return {
      label: 'Extreme',
      color: '#7c3aed',
      recommendation: 'Extreme risk. Try to stay indoors. If outside, find shade, wear protective clothing, sunglasses, and SPF 50+.',
    };
  }
};

// Mathematical Moon Phase calculation based on standard date
// Returns phase description, illumination percentage, and an index from 0 to 7
export const getMoonPhase = (dateInput) => {
  const date = dateInput ? new Date(dateInput) : new Date();
  
  // Known new moon: 2000-01-06 18:14 UTC
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const timeDiff = date.getTime() - knownNewMoon.getTime();
  
  // Lunar cycle is 29.530588853 days
  const lunarPeriod = 29.530588853 * 24 * 60 * 60 * 1000;
  
  // Calculate position in cycle
  const cycles = timeDiff / lunarPeriod;
  const phasePosition = cycles - Math.floor(cycles); // decimal from 0 to 0.999
  
  // Illumination percentage
  // 0 is new moon, 0.5 is full moon, 1.0 is new moon again
  let illumination = 0;
  if (phasePosition <= 0.5) {
    illumination = phasePosition * 2; // rises to 100%
  } else {
    illumination = (1.0 - phasePosition) * 2; // sinks to 0%
  }
  illumination = Math.round(illumination * 100);
  
  // Determine phase name
  let phaseName = '';
  let phaseIndex = 0; // 0 to 7
  
  if (phasePosition < 0.03 || phasePosition >= 0.97) {
    phaseName = 'New Moon';
    phaseIndex = 0;
  } else if (phasePosition < 0.22) {
    phaseName = 'Waxing Crescent';
    phaseIndex = 1;
  } else if (phasePosition < 0.28) {
    phaseName = 'First Quarter';
    phaseIndex = 2;
  } else if (phasePosition < 0.47) {
    phaseName = 'Waxing Gibbous';
    phaseIndex = 3;
  } else if (phasePosition < 0.53) {
    phaseName = 'Full Moon';
    phaseIndex = 4;
  } else if (phasePosition < 0.72) {
    phaseName = 'Waning Gibbous';
    phaseIndex = 5;
  } else if (phasePosition < 0.78) {
    phaseName = 'Last Quarter';
    phaseIndex = 6;
  } else {
    phaseName = 'Waning Crescent';
    phaseIndex = 7;
  }
  
  return {
    name: phaseName,
    illumination,
    index: phaseIndex,
    position: phasePosition
  };
};

// Dew Point Calculator
// Formula: Td = T - ((100 - RH)/5)  (Approximate)
export const calculateDewPoint = (temp, humidity) => {
  if (temp === undefined || humidity === undefined) return '--';
  return Math.round(temp - ((100 - humidity) / 5));
};

// Dew Point Comfort level description
export const getDewPointComfortLevel = (dewPointC) => {
  if (dewPointC < 10) return 'Very dry, comfortable air.';
  if (dewPointC < 13) return 'Pleasant and comfortable.';
  if (dewPointC < 16) return 'Slightly humid, noticeable.';
  if (dewPointC < 19) return 'Humid, muggy, uncomfortable for some.';
  if (dewPointC < 24) return 'Very humid, highly uncomfortable.';
  return 'Oppressive, extreme discomfort!';
};
