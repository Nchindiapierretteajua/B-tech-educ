// Educational color palette
const colors = {
  // Primary colors - Green tones for growth and education
  primary: {
    main: '#2E7D32', // Dark green
    light: '#4CAF50', // Medium green
    lighter: '#8BC34A', // Light green
    dark: '#1B5E20', // Very dark green
    contrast: '#FFFFFF', // White text for primary backgrounds
  },
  
  // Secondary colors - Blue tones for knowledge and trust
  secondary: {
    main: '#1565C0', // Dark blue
    light: '#42A5F5', // Medium blue
    lighter: '#90CAF9', // Light blue
    dark: '#0D47A1', // Very dark blue
    contrast: '#FFFFFF', // White text for secondary backgrounds
  },
  
  // Accent colors - Orange tones for energy and creativity
  accent: {
    main: '#FF8F00', // Dark amber
    light: '#FFC107', // Amber
    lighter: '#FFECB3', // Light amber
    dark: '#FF6F00', // Very dark amber
    contrast: '#000000', // Black text for accent backgrounds
  },
  
  // Success, warning, error states
  success: {
    main: '#2E7D32', // Same as primary for consistency
    light: '#4CAF50',
    dark: '#1B5E20',
    contrast: '#FFFFFF',
  },
  
  warning: {
    main: '#F57F17', // Dark orange
    light: '#FFB74D', // Medium orange
    dark: '#E65100', // Very dark orange
    contrast: '#000000',
  },
  
  error: {
    main: '#C62828', // Dark red
    light: '#EF5350', // Medium red
    dark: '#B71C1C', // Very dark red
    contrast: '#FFFFFF',
  },
  
  // Neutral tones
  neutral: {
    white: '#FFFFFF',
    lightest: '#F5F5F5',
    lighter: '#EEEEEE',
    light: '#E0E0E0',
    medium: '#9E9E9E',
    dark: '#616161',
    darker: '#424242',
    darkest: '#212121',
    black: '#000000',
  },
  
  // Background colors
  background: {
    default: '#FFFFFF', // White for main backgrounds
    paper: '#F5F7FA', // Slight off-white for cards
    dark: '#212121', // Dark for contrast areas
  },
  
  // Text colors
  text: {
    primary: '#212121', // Nearly black
    secondary: '#757575', // Medium gray
    disabled: '#9E9E9E', // Light gray
    hint: '#9E9E9E', // Light gray
    inverse: '#FFFFFF', // White for dark backgrounds
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',
    main: '#BDBDBD',
    dark: '#9E9E9E',
  },
  
  // Transparent colors (for overlays)
  transparent: {
    light: 'rgba(255, 255, 255, 0.8)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
};

export default colors;