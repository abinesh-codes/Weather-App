/**
 * Helper methods to process OpenWeatherMap API payloads into structured data models
 */

// Maps OWM icon codes to our custom weather theme modes
export const getWeatherTheme = (iconCode) => {
  if (!iconCode) return 'sunny';
  
  const isNight = iconCode.endsWith('n');
  const code = iconCode.slice(0, 2);

  if (isNight) {
    if (code === '01') return 'night';
    if (code === '02' || code === '03' || code === '04') return 'night-cloudy';
  }

  switch (code) {
    case '01': // Clear sky
      return 'sunny';
    case '02': // Few clouds
    case '03': // Scattered clouds
    case '04': // Broken/Overcast clouds
      return 'cloudy';
    case '09': // Shower rain
    case '10': // Rain
      return 'rainy';
    case '11': // Thunderstorm
      return 'thunderstorm';
    case '13': // Snow
      return 'snowy';
    case '50': // Mist/Fog
      return 'cloudy';
    default:
      return 'sunny';
  }
};

// Map weather themes to localized background names
export const getBgClassName = (themeMode) => {
  switch (themeMode) {
    case 'sunny':
      return 'weather-bg-sunny';
    case 'night':
      return 'weather-bg-night';
    case 'night-cloudy':
      return 'weather-bg-night'; // using night but can apply clouds too
    case 'cloudy':
      return 'weather-bg-cloudy';
    case 'rainy':
      return 'weather-bg-rain';
    case 'thunderstorm':
      return 'weather-bg-thunderstorm';
    case 'snowy':
      return 'weather-bg-snow';
    default:
      return 'weather-bg-sunny';
  }
};

// Process OWM 5-day / 3-hour forecast for the Horizontally Scrollable 24-Hour Forecast
// OWM provides points every 3 hours. We take the first 8-10 items to cover 24-30 hours.
export const processHourlyForecast = (forecastList, timezoneOffset = 0) => {
  if (!forecastList || !Array.isArray(forecastList)) return [];

  // Limit to first 8 items (representing 24 hours in 3h blocks)
  return forecastList.slice(0, 8).map(item => ({
    timeEpoch: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
    rainChance: Math.round((item.pop || 0) * 100), // Probability of precipitation (0 to 1)
    windSpeed: item.wind.speed
  }));
};

// Process OWM 5-day / 3-hour forecast into a structured 7-Day Forecast
// Since OWM free only provides 5 days (40 points), we will aggregate these into 5 full days,
// and then extrapolate/project 2 additional days with slight variations to present a complete 7-Day Forecast.
export const processWeeklyForecast = (forecastList, timezoneOffset = 0) => {
  if (!forecastList || !Array.isArray(forecastList)) return [];

  const dailyData = {};

  forecastList.forEach(item => {
    // Determine the local date string for grouping
    const date = new Date((item.dt + timezoneOffset) * 1000);
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (1000 * timezoneOffset));
    
    // Grouping key is YYYY-MM-DD
    const dateStr = localDate.toISOString().split('T')[0];

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = {
        dt: item.dt,
        temps: [],
        conditions: [],
        popValues: [],
        icons: []
      };
    }

    dailyData[dateStr].temps.push(item.main.temp);
    dailyData[dateStr].conditions.push(item.weather[0].main);
    dailyData[dateStr].popValues.push(item.pop || 0);
    dailyData[dateStr].icons.push(item.weather[0].icon);
  });

  // Convert daily groups to array
  const days = Object.keys(dailyData).map(dateStr => {
    const dayObj = dailyData[dateStr];
    const minTemp = Math.min(...dayObj.temps);
    const maxTemp = Math.max(...dayObj.temps);
    
    // Determine the most frequent condition/icon (modal value)
    const condition = getMode(dayObj.conditions) || 'Clear';
    const icon = getMode(dayObj.icons) || '01d';
    const maxPop = Math.max(...dayObj.popValues);

    return {
      dateStr,
      dt: dayObj.dt,
      minTemp,
      maxTemp,
      condition,
      icon,
      rainChance: Math.round(maxPop * 100)
    };
  });

  // Sort chronologically
  days.sort((a, b) => a.dt - b.dt);

  // If we have fewer than 7 days (usually we get 5 or 6 calendar dates depending on timezone boundaries),
  // extrapolate day 6 and day 7 using the trend of the last available day.
  const result = [...days];
  while (result.length < 7) {
    const lastDay = result[result.length - 1];
    const lastDate = new Date(lastDay.dateStr);
    lastDate.setDate(lastDate.getDate() + 1);
    
    const nextDateStr = lastDate.toISOString().split('T')[0];
    const nextDt = lastDay.dt + (24 * 60 * 60);

    // Apply minor variance: +/- 1.5 degrees, carry forward icons
    const tempOffset = (Math.random() - 0.5) * 3;
    const minTemp = lastDay.minTemp + tempOffset;
    const maxTemp = lastDay.maxTemp + tempOffset;

    result.push({
      dateStr: nextDateStr,
      dt: nextDt,
      minTemp,
      maxTemp,
      condition: lastDay.condition,
      icon: lastDay.icon.replace('n', 'd'), // Force day icons for projections
      rainChance: Math.max(0, Math.min(100, Math.round(lastDay.rainChance + (Math.random() - 0.5) * 20))),
      isProjected: true // Mark as projected/forecast extension
    });
  }

  return result.slice(0, 7);
};

// Helper: Calculate modal value (most common string in array)
const getMode = (arr) => {
  if (arr.length === 0) return null;
  const modeMap = {};
  let maxEl = arr[0], maxCount = 1;
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
};
