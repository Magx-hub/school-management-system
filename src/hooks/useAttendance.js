import { useCallback, useMemo, useState } from 'react';
import { submitAttendanceRecord, updateAttendanceRecordById, fetchAttendanceByDate, fetchAttendanceByTeacherRange, computeDailyStats, computeWeeklyStats } from '../services/attendanceFirebaseService';
import { getAttendanceByDateRange } from '../services/firebaseService';
import { calculateAcademicWeek } from '../utils/attendanceUtils';

export const useAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ date: null, teacherId: null, startDate: null, endDate: null });

  const loadByDate = useCallback(async (date) => {
    setLoading(true); setError(null);
    try {
      const rows = await fetchAttendanceByDate(date);
      setRecords(rows);
    } catch (e) {
      setError(e.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByTeacherRange = useCallback(async (teacherId, startDate, endDate) => {
    setLoading(true); setError(null);
    try {
      const rows = await fetchAttendanceByTeacherRange(teacherId, startDate, endDate);
      setRecords(rows);
    } catch (e) {
      setError(e.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadByDateRange = useCallback(async (startDate, endDate) => {
    setLoading(true); setError(null);
    try {
      const rows = await getAttendanceByDateRange(startDate, endDate);
      setRecords(rows);
    } catch (e) {
      setError(e.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveRecord = useCallback(async (payload) => {
    setLoading(true); setError(null);
    try {
      const id = await submitAttendanceRecord(payload);
      // Optimistic reload for current date
      if (payload.date) {
        await loadByDate(payload.date);
      }
      return id;
    } catch (e) {
      setError(e.message || 'Failed to save attendance');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [loadByDate]);

  const updateRecord = useCallback(async (id, updates) => {
    setLoading(true); setError(null);
    try {
      await updateAttendanceRecordById(id, updates);
      // best-effort refresh if filters has date
      if (filters.date) await loadByDate(filters.date);
    } catch (e) {
      setError(e.message || 'Failed to update attendance');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [filters, loadByDate]);

  const stats = useMemo(() => ({
    daily: computeDailyStats(records),
    weekly: computeWeeklyStats(records),
  }), [records]);

  const updateFilters = useCallback((next) => setFilters(prev => ({ ...prev, ...next })), []);

  const getWeekNumber = useCallback((date) => calculateAcademicWeek(date), []);

  return {
    records,
    loading,
    error,
    filters,
    loadByDate,
    loadByTeacherRange,
    loadByDateRange,
    saveRecord,
    updateRecord,
    updateFilters,
    stats,
    getWeekNumber,
  };
};


// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from './firebase-config'; // Your Firebase config



// Add an attendance record
// const addAttendanceRecord = async (attendanceData) => {
//   try {
//     const docRef = await addDoc(collection(db, 'attendance'), {
//       teacherId: attendanceData.teacherId,
//       checkInTime: attendanceData.checkInTime,
//       checkOutTime: attendanceData.checkOutTime,
//       workHours: attendanceData.workHours,
//       date: attendanceData.date,
//       weekNum: attendanceData.weekNum,
//       status: attendanceData.status,
//       remarks: attendanceData.remarks || '',
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp()
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// };

