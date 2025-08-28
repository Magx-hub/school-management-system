// utils/attendanceUtils.js
export const calculateWorkHours = (checkInTime, checkOutTime) => {
  if (!checkInTime || !checkOutTime) return 0;
  
  try {
    const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
    const [checkOutHour, checkOutMinute] = checkOutTime.split(':').map(Number);
    
    const checkInMinutes = checkInHour * 60 + checkInMinute;
    const checkOutMinutes = checkOutHour * 60 + checkOutMinute;
    
    // Handle overnight shifts
    const totalMinutes = checkOutMinutes >= checkInMinutes 
      ? checkOutMinutes - checkInMinutes 
      : (24 * 60) - checkInMinutes + checkOutMinutes;
    
    return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    // console.error('Error calculating work hours:', error);
    return 0;
  }
};

export const determineStatus = (checkInTime, expectedTime = '08:00') => {
  if (!checkInTime) return 'Absent';
  
  try {
    const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
    const [expectedHour, expectedMinute] = expectedTime.split(':').map(Number);
    
    const checkInMinutes = checkInHour * 60 + checkInMinute;
    const expectedMinutes = expectedHour * 60 + expectedMinute;
    
    if (checkInMinutes <= expectedMinutes) return 'Present';
    if (checkInMinutes <= expectedMinutes + 30) return 'Late'; // 30 minutes grace period
    return 'Very Late';
  } catch (error) {
    // console.error('Error determining status:', error);
    return 'Unknown';
  }
};

export const calculateAcademicWeek = (date, academicYearStart = '2024-09-01') => {
  try {
    const targetDate = new Date(date);
    const startDate = new Date(academicYearStart);
    
    const diffTime = targetDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const weekNum = Math.ceil(diffDays / 7);
    
    // Ensure week number is between 1 and 16
    return Math.max(1, Math.min(16, weekNum));
  } catch (error) {
    // console.error('Error calculating academic week:', error);
    return 1;
  }
};

export const sanitizeInput = (input, type = 'text') => {
  if (typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  switch (type) {
    case 'name':
      // Remove special characters, keep only letters, spaces, apostrophes, hyphens
      sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
      break;
    case 'time':
      // Validate time format HH:MM
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(sanitized)) return '';
      break;
    case 'date':
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(sanitized)) return '';
      break;
    default:
      // Basic XSS prevention
      sanitized = sanitized.replace(/[<>"']/g, '');
  }
  
  return sanitized;
};
