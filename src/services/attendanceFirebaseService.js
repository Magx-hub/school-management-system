

import { 
  addAttendance,
  getAttendanceByDate,
  getAttendanceByTeacher,
  updateAttendance,
  getTeacherById
} from './firebaseService';
import { calculateWorkHours, determineStatus, calculateAcademicWeek, sanitizeInput } from '../utils/attendanceUtils';

// Wrapper ensuring consistent field shapes and calculations used by UI/hook

export const submitAttendanceRecord = async ({ teacherId, date, checkInTime, checkOutTime, status, remarks }) => {
  const safeTeacherId = sanitizeInput(String(teacherId || ''), 'text');
  const safeDate = sanitizeInput(date || '', 'date');
  const safeCheckIn = sanitizeInput(checkInTime || '', 'time');
  const safeCheckOut = sanitizeInput(checkOutTime || '', 'time');
  const computedStatus = status || determineStatus(safeCheckIn);
  const weekNum = calculateAcademicWeek(safeDate);
  const workHours = calculateWorkHours(safeCheckIn, safeCheckOut);
  
  const teacher = await getTeacherById(safeTeacherId);

  const payload = {
    teacherId: safeTeacherId,
    fullname: teacher.fullname,
    date: safeDate,
    weekNum,
    checkInTime: safeCheckIn || null,
    checkOutTime: safeCheckOut || null,
    workHours: Number.isFinite(workHours) ? workHours : 0,
    status: computedStatus,
    remarks: (remarks || '').trim()
  };

  const id = await addAttendance(payload);
  return id;
};


export const updateAttendanceRecordById = async (id, updates) => {
  const safe = {
    ...(updates.checkInTime !== undefined ? { checkInTime: sanitizeInput(updates.checkInTime || '', 'time') || null } : {}),
    ...(updates.checkOutTime !== undefined ? { checkOutTime: sanitizeInput(updates.checkOutTime || '', 'time') || null } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
    ...(updates.remarks !== undefined ? { remarks: (updates.remarks || '').trim() } : {}),
  };

  if (safe.checkInTime !== undefined || safe.checkOutTime !== undefined) {
    const hours = calculateWorkHours(safe.checkInTime, safe.checkOutTime);
    safe.workHours = Number.isFinite(hours) ? hours : 0;
    if (!safe.status && safe.checkInTime) {
      safe.status = determineStatus(safe.checkInTime);
    }
  }

  await updateAttendance(id, safe);
  return true;
};

export const fetchAttendanceByDate = async (date) => {
  const safeDate = sanitizeInput(date || '', 'date');
  const rows = await getAttendanceByDate(safeDate);
  return rows.map(mapRow);
};

export const fetchAttendanceByTeacherRange = async (teacherId, startDate, endDate) => {
  const rows = await getAttendanceByTeacher(teacherId, startDate, endDate);
  return rows.map(mapRow);
};

// Aggregations for reports
export const computeDailyStats = (records) => {
  const totals = {
    totalRecords: records.length,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    halfDayCount: 0,
    avgWorkHours: 0,
  };

  let sumHours = 0;
  records.forEach(r => {
    if (r.status === 'Present') totals.presentCount += 1;
    if (r.status === 'Absent') totals.absentCount += 1;
    if (r.status === 'Late' || r.status === 'Very Late') totals.lateCount += 1;
    if (r.status === 'Half Day') totals.halfDayCount += 1;
    sumHours += r.workHours || 0;
  });
  totals.avgWorkHours = records.length > 0 ? Number((sumHours / records.length).toFixed(2)) : 0;
  return totals;
};

export const computeWeeklyStats = (records) => {
  // group by teacher
  const byTeacher = new Map();
  for (const r of records) {
    const key = r.teacherId || 'unknown';
    if (!byTeacher.has(key)) byTeacher.set(key, { fullname: r.fullname || 'Unknown', department: r.department || 'Unknown', daysTracked: 0, presentDays: 0, totalWorkHours: 0, avgWorkHours: 0 });
    const agg = byTeacher.get(key);
    agg.daysTracked += 1;
    if (r.status === 'Present') agg.presentDays += 1;
    agg.totalWorkHours += r.workHours || 0;
  }
  byTeacher.forEach(agg => {
    agg.avgWorkHours = agg.daysTracked > 0 ? Number((agg.totalWorkHours / agg.daysTracked).toFixed(2)) : 0;
  });
  return Array.from(byTeacher.values()).sort((a, b) => a.fullname.localeCompare(b.fullname));
};

const mapRow = (row) => ({
  id: row.id,
  teacherId: row.teacherId,
  fullname: row.fullname,
  department: row.department,
  date: row.date,
  weekNum: row.weekNum,
  checkInTime: row.checkInTime || null,
  checkOutTime: row.checkOutTime || null,
  workHours: row.workHours || 0,
  status: row.status,
  remarks: row.remarks || '',
});


