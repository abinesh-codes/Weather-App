import React from 'react';
import BottomNav from '../BottomNav';

const MobileLayout = ({ children }) => {
  return (
    <div className="mobile-layout-shell">
      <main className="mobile-main-content">
        {children}
      </main>
      <BottomNav />
      <style>{`
        .mobile-layout-shell {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }
        .mobile-main-content {
          flex-grow: 1;
          padding-bottom: 74px; /* Space for bottom navigation */
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default MobileLayout;
