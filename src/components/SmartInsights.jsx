import React, { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import { FiSliders, FiSun, FiActivity, FiBriefcase, FiCompass } from 'react-icons/fi';

const SmartInsights = () => {
  const { weatherData } = useWeather();
  const current = weatherData?.current;
  const pollution = weatherData?.pollution;

  const insights = useMemo(() => {
    if (!current) return [];

    const temp = current.main.temp;
    const humidity = current.main.humidity;
    const windSpeed = current.wind.speed * 3.6; // m/s to km/h
    const cond = current.weather[0].main;
    const clouds = current.clouds.all;
    const aqi = pollution?.main?.aqi || 1;

    const list = [];

    // 1. Clothing Insight
    let clothing = 'Dress comfortably for moderate weather.';
    if (temp < 10) {
      clothing = 'Cold weather ahead. Wear a heavy coat, gloves, and a warm scarf.';
    } else if (temp < 18) {
      clothing = 'Cool breeze. A light jacket, sweater, or layered clothing is recommended.';
    } else if (temp > 30) {
      clothing = 'Hot outside. Wear lightweight, breathable cotton fabrics and a cap.';
    }
    if (cond === 'Rain' || cond === 'Drizzle') {
      clothing += ' Carry a waterproof raincoat or an umbrella.';
    } else if (cond === 'Snow') {
      clothing += ' Wear insulated waterproof boots for snow accumulation.';
    }
    list.push({
      category: 'Clothing',
      icon: FiSliders,
      tip: clothing,
      color: '#0ea5e9'
    });

    // 2. Activities Insight
    let activity = 'Great conditions for outdoor walks, jogs, and park visits.';
    if (cond === 'Rain' || cond === 'Thunderstorm' || cond === 'Snow') {
      activity = 'Inclement weather. Better to choose indoor workouts or cardio routines today.';
    } else if (temp > 35) {
      activity = 'Excessive heat. Avoid intense exercises during peak sun hours. Work out indoors.';
    } else if (aqi >= 4) {
      activity = 'Poor air quality. High particulate concentrations. Avoid outdoor running or cycling.';
    } else if (windSpeed > 30) {
      activity = 'Very windy. Not ideal for badminton, cycling, or outdoor tennis.';
    }
    list.push({
      category: 'Activities',
      icon: FiSun,
      tip: activity,
      color: '#f59e0b'
    });

    // 3. Health & Sun Safety
    let health = 'Stay hydrated throughout the day.';
    if (aqi >= 3) {
      health = 'Sensitive individuals should wear a mask outdoors due to elevated pollution levels.';
    }
    if (temp > 32) {
      health += ' Drink plenty of water (at least 3 liters) to avoid heat exhaustion.';
    }
    if (clouds < 30 && temp > 22) {
      health += ' Clear skies. Wear SPF 30+ sunscreen and UV-blocking sunglasses.';
    }
    list.push({
      category: 'Health',
      icon: FiActivity,
      tip: health,
      color: '#10b981'
    });

    // 4. Commute & Logistics
    let commute = 'Normal traffic conditions expected.';
    if (cond === 'Rain' || cond === 'Drizzle') {
      commute = 'Wet roadways. Increase braking distance and anticipate slow-moving traffic.';
    } else if (cond === 'Thunderstorm') {
      commute = 'Severe storm hazard. Avoid driving through waterlogged zones; secure loose outdoor items.';
    } else if (current.visibility < 3000) {
      commute = 'Fog or haze is restricting visibility. Use fog lights and drive with caution.';
    }
    list.push({
      category: 'Travel & Commute',
      icon: FiBriefcase,
      tip: commute,
      color: '#a78bfa'
    });

    return list;
  }, [current, pollution]);

  if (insights.length === 0) return null;

  return (
    <div className="smart-insights-container glass-panel">
      <h3 className="section-title">Smart Weather Insights</h3>
      
      <div className="insights-list">
        {insights.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="insight-item">
              <div 
                className="insight-icon-box"
                style={{ 
                  color: item.color, 
                  backgroundColor: `${item.color}15`,
                  borderColor: `${item.color}30`
                }}
              >
                <Icon />
              </div>
              <div className="insight-text-box">
                <span className="insight-category">{item.category}</span>
                <p className="insight-tip">{item.tip}</p>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .smart-insights-container {
          padding: 24px;
          width: 100%;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insight-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .insight-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .insight-text-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .insight-category {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .insight-tip {
          font-size: 0.88rem;
          line-height: 1.45;
          color: var(--text-main);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default SmartInsights;
