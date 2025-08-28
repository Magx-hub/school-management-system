import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiBookOpen, 
  FiCoffee,
  FiSettings 
} from 'react-icons/fi';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/teachers', icon: FiUsers, label: 'Teachers' },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
    { path: '/allowance', icon: FiDollarSign, label: 'Allowance' },
    { path: '/students', icon: FiBookOpen, label: 'Students' },
    { path: '/canteen', icon: FiCoffee, label: 'Canteen' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>School Admin</h2>
      </div>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
    width: '250px',
    height: '100vh',
    backgroundColor: COLORS.white,
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    ...SHADOWS.medium,
  },
  logo: {
    padding: SIZES.padding,
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.primary,
  },
  logoText: {
    color: COLORS.white,
    fontSize: SIZES.h4,
    fontWeight: FONTS.bold,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  nav: {
    flex: 1,
    padding: SIZES.paddingSm,
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
  },
  navItemActive: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
  },
  navIcon: {
    marginRight: SIZES.paddingSm,
  },
  navLabel: {
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
  },
};

export default Sidebar;
