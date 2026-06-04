import React from 'react';
import { useWeather } from '../context/WeatherContext';

const GlobalWeatherEffects = () => {
  const { weatherData } = useWeather();
  const weatherTheme = weatherData?.weatherTheme || 'sunny';

  const renderBackgroundEffects = () => {
    switch (weatherTheme) {
      case 'sunny':
        return <div className="sun-glow"></div>;
      case 'night':
        return (
          <>
            <div className="moon-glow"></div>
            <div className="stars-container">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="star"
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 95}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 2 + 2}s`
                  }}
                ></div>
              ))}
            </div>
          </>
        );
      case 'rainy':
        return (
          <div className="rain-particles">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 0.8 + 0.8}s`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              ></div>
            ))}
          </div>
        );
      case 'cloudy':
        return (
          <div className="moving-clouds">
            <div className="cloud-shape" style={{ top: '10vh', left: '10vw', width: '220px', height: '60px', animationDuration: '40s' }}></div>
            <div className="cloud-shape" style={{ top: '35vh', right: '15vw', width: '320px', height: '80px', animationDuration: '60s' }}></div>
            <div className="cloud-shape" style={{ top: '60vh', left: '25vw', width: '260px', height: '70px', animationDuration: '50s' }}></div>
          </div>
        );
      case 'thunderstorm':
        return (
          <>
            <div className="lightning-flash"></div>
            <div className="rain-particles">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="rain-drop"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2.5}s`,
                    animationDuration: `${Math.random() * 0.7 + 0.6}s`,
                    opacity: Math.random() * 0.6 + 0.3
                  }}
                ></div>
              ))}
            </div>
          </>
        );
      case 'snowy':
        return (
          <div className="snow-particles">
            {[...Array(65)].map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  opacity: Math.random() * 0.8 + 0.2
                }}
              ></div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="global-weather-effects">
      {renderBackgroundEffects()}
    </div>
  );
};

export default GlobalWeatherEffects;
