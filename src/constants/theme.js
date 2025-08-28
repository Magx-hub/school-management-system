// Professional Educational Admin Color Theme
export const COLORS = {
  // Primary brand colors - Blue-Green Professional Palette
  primary: '#1E88E5',           // Professional Blue - main brand color
  primaryDark: '#1565C0',       // Dark Blue - darker variant
  primaryLight: '#E3F2FD',      // Light Blue - lighter variant
  secondary: '#2E7D32',         // Forest Green - secondary actions
  accent: '#1565C0',            // Dark Blue - text and accents
  
  // Status colors
  success: '#388E3C',           // Green - positive outcomes
  warning: '#F57C00',           // Orange - warnings and alerts
  error: '#D32F2F',             // Red - errors and critical issues
  info: '#1976D2',              // Blue - information and guidance
  
  // Text colors
  textPrimary: '#263238',       // Dark Blue Gray - primary text
  textSecondary: '#546E7A',     // Medium Blue Gray - secondary text
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000', 
  gray: '#9E9E9E',              // Neutral gray
  grayLight: '#F5F5F5',         // Light gray
  grayDark: '#424242',          // Dark gray
  
  // UI elements
  border: '#E0E0E0',            // Light border
  placeholder: '#9E9E9E',       // Neutral placeholder
  backdrop: 'rgba(21,101,192,0.5)', // Blue backdrop
  
  // Legacy support
  secondaryLight: '#E8F5E8',    // Light Green
  secondaryDark: '#1B5E20',     // Dark Green
};

export const SIZES = {
  // Spacing
  padding: 20,
  margin: 15,
  paddingSm: 10,
  marginSm: 8,
  
  // Border radius
  borderRadius: 6,
  borderRadiusMd: 12,
  borderRadiusLg: 25,
  textBoxRadius: 25,
  
  // Font sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 15,
  default: 14,
  
  // Icon sizes
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  
  // Button sizes
  buttonHeight: 48,
  inputHeight: 48,
};

export const FONTS = {
  // Font family
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  
  // Font weights
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

export const SHADOWS = {
  small: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  medium: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  large: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
};

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
};
