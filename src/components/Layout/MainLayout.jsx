import React from 'react';
import Sidebar from './Sidebar';
import { COLORS, SIZES } from '../../constants/theme';

const MainLayout = ({ children }) => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
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
  },
  main: {
    flex: 1,
    marginLeft: '250px', // Width of sidebar
    padding: SIZES.padding,
    minHeight: '100vh',
  },
};

export default MainLayout;
