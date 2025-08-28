import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiBookOpen, 
  FiCoffee,
  FiSettings,
  FiX
} from 'react-icons/fi';
import { COLORS, SIZES, FONTS, SHADOWS, BREAKPOINTS } from '../../constants/theme';

const Sidebar = ({ isOpen, isMobile, onClose, onToggle }) => {
  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/teachers', icon: FiUsers, label: 'Teachers' },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
    { path: '/calculator', icon: FiDollarSign, label: 'Friday Allowance' },
    { path: '/students', icon: FiBookOpen, label: 'Students' },
    { path: '/canteen', icon: FiCoffee, label: 'Canteen' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div style={{
      ...styles.sidebar,
      transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      width: isMobile ? '280px' : '250px',
      zIndex: isMobile ? 1000 : 1000,
    }}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>School Admin</h2>
        {isMobile && (
          <button 
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {})
            })}
          >
            <item.icon size={20} style={styles.navIcon} />
            <span style={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    height: '100vh',
    backgroundColor: COLORS.white,
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    transition: 'transform 0.3s ease-in-out',
    ...SHADOWS.medium,
  },
  logo: {
    padding: SIZES.padding,
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    color: COLORS.white,
    fontSize: SIZES.h4,
    fontWeight: FONTS.bold,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: COLORS.white,
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    padding: SIZES.paddingSm,
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    marginBottom: SIZES.marginSm,
    borderRadius: SIZES.borderRadius,
    textDecoration: 'none',
    color: COLORS.textSecondary,
    transition: 'all 0.2s ease',
    fontFamily: FONTS.fontFamily,
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
    minHeight: '48px',
  },
  navItemActive: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  navIcon: {
    marginRight: SIZES.paddingSm,
    flexShrink: 0,
  },
  navLabel: {
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
  },
};

export default Sidebar;
