
export const parseTimeString = (timeStr) => {
 if (!timeStr || typeof timeStr !== 'string') return null;

 const s = timeStr.trim();

 // Match 12h with optional space before AM/PM
 // Groups: 1=hour, 2=minute, 3=AM/PM (optional)
 const re = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
 const m = s.match(re);
 if (!m) return null;

 let hours = parseInt(m[1], 10);
 const minutes = parseInt(m[2], 10);
 const period = m[3] ? m[3].toUpperCase() : null;

 // Basic bounds
 if (minutes < 0 || minutes > 59) return null;
 if (period) {
   // 12-hour clock bounds
   if (hours < 1 || hours > 12) return null;
   if (period === 'PM' && hours < 12) hours += 12;
   if (period === 'AM' && hours === 12) hours = 0;
 } else {
   // 24-hour clock bounds
   if (hours < 0 || hours > 23) return null;
 }

 return { hours, minutes };
};

/**
* Compute decimal hour difference between two time strings.
* Returns a number (e.g., 7.5). Returns 0 when invalid or non-positive.
*/
export const calculateWorkHours = (checkInTime, checkOutTime) => {
 const inTime = parseTimeString(checkInTime);
 const outTime = parseTimeString(checkOutTime);

 if (!inTime || !outTime) return 0;

 const inMinutes = inTime.hours * 60 + inTime.minutes;
 const outMinutes = outTime.hours * 60 + outTime.minutes;

 if (outMinutes <= inMinutes) return 0;

 const diffMinutes = outMinutes - inMinutes;
 const workHours = diffMinutes / 60;
 const rounded = Math.round(workHours * 10) / 10;

 // Normalize -0 to 0
 return rounded === 0 ? 0 : rounded;
};