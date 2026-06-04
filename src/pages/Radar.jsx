import React from 'react';
import WeatherRadar from '../components/WeatherRadar';
import { motion } from 'framer-motion';

const Radar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="radar-page-container"
    >
      <div className="radar-header">
        <h2>Live Weather Radar</h2>
        <p>Monitor real-time storms, precipitation, wind speed, and temperatures globally.</p>
      </div>

      <div className="radar-content-box">
        <WeatherRadar />
      </div>

      <style>{`
        .radar-page-container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          min-height: calc(100vh - 100px);
        }

        .radar-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
        }

        .radar-header p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 4px;
          font-weight: 500;
        }

        .radar-content-box {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .radar-page-container {
            padding: 40px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Radar;
