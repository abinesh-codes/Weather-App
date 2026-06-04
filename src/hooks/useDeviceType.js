import { useState, useEffect } from 'react';

const getDeviceType = (width) => {
  if (width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  if (width < 1600) return 'laptop';
  return 'desktop';
};

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(() => getDeviceType(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};
