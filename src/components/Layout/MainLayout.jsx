import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { COLORS, SIZES, BREAKPOINTS } from '../../constants/theme';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= parseInt(BREAKPOINTS.tablet));
      if (window.innerWidth > parseInt(BREAKPOINTS.tablet)) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobile} 
        onClose={closeSidebar}
        onToggle={toggleSidebar}
      />
      
      {/* Mobile Header */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button 
            onClick={toggleSidebar}
            style={styles.menuButton}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 style={styles.mobileTitle}>School Admin</h1>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={closeSidebar} />
      )}

      <main style={{
        ...styles.main,
        marginLeft: isMobile ? 0 : '250px',
        paddingTop: isMobile ? '70px' : SIZES.padding,
      }}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: COLORS.grayLight,
    position: 'relative',
  },
  main: {
    flex: 1,
    padding: SIZES.padding,
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
  },
  mobileHeader: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${SIZES.padding}px`,
    zIndex: 999,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.paddingSm,
  },
  mobileTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    margin: 0,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
};

export default MainLayout;
