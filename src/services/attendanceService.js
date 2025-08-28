import { calculateWorkHours } from '../utils/helpers';
import { getDatabaseInstance } from '../utils/database';

// ===========================================
// ATTENDANCE CRUD OPERATIONS
// ===========================================

export const addAttendanceRecord = async (record) => {
  try {
    const db = getDatabaseInstance();
    const { teacherId, checkInTime, checkOutTime, date, weekNum, status, remarks } = record;
    
    // Calculate work hours if both times are present
    let workHours = calculateWorkHours(checkInTime, checkOutTime);

    const result = await db.runAsync(
      `INSERT INTO attendance 
      (teacherId, checkInTime, checkOutTime, workHours, date, weekNum, status, remarks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [teacherId, checkInTime, checkOutTime, workHours, date, weekNum, status, remarks]
    );
    
    return result.insertId;
  } catch (error) {
    // console.error('Error adding attendance record:', error);
    throw error;
  }
};

export const getAttendanceRecords = async (filters = {}) => {
  try {
    const db = getDatabaseInstance();
    
    let query = `
      SELECT a.*, t.fullname, t.department 
      FROM attendance a
      JOIN teachers t ON a.teacherId = t.id
    `;
    const params = [];
    const conditions = [];
    
    if (filters.teacherId) {
      conditions.push('a.teacherId = ?');
      params.push(filters.teacherId);
    }
    if (filters.date) {
      conditions.push('a.date = ?');
      params.push(filters.date);
    }
    if (filters.weekNum) {
      conditions.push('a.weekNum = ?');
      params.push(filters.weekNum);
    }
    if (filters.department) {
      conditions.push('t.department = ?');
      params.push(filters.department);
    }
    if (filters.status) {
      conditions.push('a.status = ?');
      params.push(filters.status);
    }
    
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.date DESC, t.fullname ASC';
    
    const records = await db.getAllAsync(query, params);
    return records;
  } catch (error) {
    // console.error('Error getting attendance records:', error);
    throw error;
  }
};

export const getAttendanceById = async (id) => {
  try {
    const db = getDatabaseInstance();
    const record = await db.getFirstAsync(
      `SELECT a.*, t.fullname, t.department 
       FROM attendance a
       JOIN teachers t ON a.teacherId = t.id
       WHERE a.id = ?`,
      [id]
    );
    return record;
  } catch (error) {
    // console.error('Error getting attendance record by ID:', error);
    throw error;
  }
};

export const updateAttendanceRecord = async (id, updates) => {
  try {
    const db = getDatabaseInstance();
    const { checkInTime, checkOutTime, status, remarks } = updates;
    
    // Calculate work hours if both times are present
    let workHours = calculateWorkHours(checkInTime, checkOutTime);
    
    const result = await db.runAsync(
      `UPDATE attendance 
       SET checkInTime = ?, checkOutTime = ?, workHours = ?, status = ?, remarks = ?, updatedAt = datetime("now", "localtime")
       WHERE id = ?`,
      [checkInTime, checkOutTime, workHours, status, remarks, id]
    );
    
    return result.changes > 0;
  } catch (error) {
    // console.error('Error updating attendance record:', error);
    throw error;
  }
};

export const deleteAttendanceRecord = async (id) => {
  try {
    const db = getDatabaseInstance();
    const result = await db.runAsync('DELETE FROM attendance WHERE id = ?', [id]);
    return result.changes > 0;
  } catch (error) {
    // console.error('Error deleting attendance record:', error);
    throw error;
  }
};

// ===========================================
// ATTENDANCE BUSINESS LOGIC & UTILITIES
// ===========================================

export const getAttendanceByDateRange = async (startDate, endDate, filters = {}) => {
  try {
    const db = getDatabaseInstance();
    
    let query = `
      SELECT a.*, t.fullname, t.department 
      FROM attendance a
      JOIN teachers t ON a.teacherId = t.id
      WHERE a.date BETWEEN ? AND ?
    `;
    const params = [startDate, endDate];
    
    if (filters.teacherId) {
      query += ' AND a.teacherId = ?';
      params.push(filters.teacherId);
    }
    if (filters.department) {
      query += ' AND t.department = ?';
      params.push(filters.department);
    }
    
    query += ' ORDER BY a.date DESC, t.fullname ASC';
    
    const records = await db.getAllAsync(query, params);
    return records;
  } catch (error) {
    // console.error('Error getting attendance by date range:', error);
    throw error;
  }
};

export const getTeacherAttendanceSummary = async (teacherId, month, year) => {
  try {
    const db = getDatabaseInstance();
    const summary = await db.getFirstAsync(
      `SELECT 
        COUNT(*) as totalDays,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as presentDays,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absentDays,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as lateDays,
        SUM(CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END) as halfDays,
        AVG(workHours) as avgWorkHours,
        SUM(workHours) as totalWorkHours
       FROM attendance 
       WHERE teacherId = ? AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`,
      [teacherId, month.toString().padStart(2, '0'), year.toString()]
    );
    
    if (summary) {
      const totalDays = summary.totalDays || 0;
      const presentDays = summary.presentDays || 0;
      const attendanceRating = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      return {
        ...summary,
        attendanceRating,
        lateCount: summary.lateDays || 0,
        absentCount: summary.absentDays || 0,
        halfDayCount: summary.halfDays || 0,
        avgWorkHours: summary.avgWorkHours || 0,
        totalWorkHours: summary.totalWorkHours || 0
      };
    }
    
    return summary;
  } catch (error) {
    // console.error('Error getting teacher attendance summary:', error);
    throw error;
  }
};

export const getDailyAttendanceStats = async (date) => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getFirstAsync(
      `SELECT 
        COUNT(*) as totalRecords,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as presentCount,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absentCount,
        SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as lateCount,
        SUM(CASE WHEN status = 'Half Day' THEN 1 ELSE 0 END) as halfDayCount,
        AVG(workHours) as avgWorkHours
       FROM attendance 
       WHERE date = ?`,
      [date]
    );
    return stats;
  } catch (error) {
    // console.error('Error getting daily attendance stats:', error);
    throw error;
  }
};

export const getWeeklyAttendanceStats = async (weekNum) => {
  try {
    const db = getDatabaseInstance();
    const stats = await db.getAllAsync(
      `SELECT 
        t.fullname,
        t.department,
        COUNT(*) as daysTracked,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as presentDays,
        SUM(a.workHours) as totalWorkHours,
        AVG(a.workHours) as avgWorkHours
       FROM attendance a
       JOIN teachers t ON a.teacherId = t.id
       WHERE a.weekNum = ?
       GROUP BY a.teacherId, t.fullname, t.department
       ORDER BY t.fullname`,
      [weekNum]
    );
    return stats;
  } catch (error) {
    // console.error('Error getting weekly attendance stats:', error);
    throw error;
  }
};

export const checkDuplicateAttendance = async (teacherId, date) => {
  try {
    const db = getDatabaseInstance();
    const existing = await db.getFirstAsync(
      'SELECT id FROM attendance WHERE teacherId = ? AND date = ?',
      [teacherId, date]
    );
    return existing !== null;
  } catch (error) {
    // console.error('Error checking duplicate attendance:', error);
    throw error;
  }
};

export const bulkAddAttendance = async (records) => {
  try {
    const db = getDatabaseInstance();
    
    // Use transaction for bulk operations
    await db.withTransactionAsync(async () => {
      for (const record of records) {
        const { teacherId, checkInTime, checkOutTime, date, weekNum, status, remarks } = record;
        let workHours = calculateWorkHours(checkInTime, checkOutTime);
        
        await db.runAsync(
          `INSERT INTO attendance 
          (teacherId, checkInTime, checkOutTime, workHours, date, weekNum, status, remarks) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [teacherId, checkInTime, checkOutTime, workHours, date, weekNum, status, remarks]
        );
      }
    });
    
    return true;
  } catch (error) {
    // console.error('Error bulk adding attendance records:', error);
    throw error;
  }
};

export const searchAttendance = async (searchTerm) => {
  try {
    const db = getDatabaseInstance();
    const records = await db.getAllAsync(
      `SELECT a.*, t.fullname, t.department
       FROM attendance a
       JOIN teachers t ON a.teacherId = t.id
       WHERE t.fullname LIKE ? OR t.department LIKE ?
       ORDER BY t.fullname ASC, a.date DESC`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return records;
  } catch (error) {
    // console.error('Error searching attendance:', error);
    throw error;
  }
};

export const getLatestAttendancePerTeacher = async () => {
  try {
    const db = getDatabaseInstance();
    const records = await db.getAllAsync(
      `SELECT a.*, t.fullname, t.department
       FROM attendance a
       JOIN teachers t ON a.teacherId = t.id
       WHERE a.id = (
         SELECT MAX(id) 
         FROM attendance a2 
         WHERE a2.teacherId = a.teacherId
       )
       ORDER BY t.fullname ASC`
    );
    return records;
  } catch (error) {
    // console.error('Error getting latest attendance per teacher:', error);
    throw error;
  }
};

export const searchAttendanceAdvanced = async (filters) => {
  try {
    const db = getDatabaseInstance();
    
    let query = `
      SELECT a.*, t.fullname, t.department 
      FROM attendance a
      JOIN teachers t ON a.teacherId = t.id
    `;
    const params = [];
    const conditions = [];
    
    if (filters.teacherName) {
      conditions.push('t.fullname LIKE ?');
      params.push(`%${filters.teacherName}%`);
    }
    if (filters.weekNum) {
      conditions.push('a.weekNum = ?');
      params.push(filters.weekNum);
    }
    if (filters.status) {
      conditions.push('a.status = ?');
      params.push(filters.status);
    }
    if (filters.date) {
      conditions.push('a.date = ?');
      params.push(filters.date);
    }
    
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.date DESC, t.fullname ASC';
    
    const records = await db.getAllAsync(query, params);
    return records;
  } catch (error) {
    // console.error('Error searching attendance with advanced filters:', error);
    throw error;
  }
};

// ===========================================
// TEACHER ATTENDANCE SUMMARIES
// ===========================================

export const getAllTeachersAttendanceSummary = async () => {
  try {
    const db = getDatabaseInstance();
    const summaries = await db.getAllAsync(`
      SELECT 
        t.id,
        t.fullname,
        t.department,
        COUNT(a.id) as totalAttendance,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as totalPresent,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as totalAbsent,
        SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as totalLate,
        SUM(CASE WHEN a.status = 'Half Day' THEN 1 ELSE 0 END) as totalHalfDay,
        AVG(a.workHours) as avgWorkHours,
        SUM(a.workHours) as totalWorkHours,
        MIN(a.checkInTime) as bestCheckInTime,
        MAX(a.checkInTime) as worstCheckInTime,
        MAX(a.date) as lastAttendanceDate
      FROM teachers t
      LEFT JOIN attendance a ON t.id = a.teacherId
      GROUP BY t.id, t.fullname, t.department
      ORDER BY t.fullname ASC
    `);
    
    // Calculate rating for each teacher and map fields correctly
    return summaries.map(summary => {
      const totalDays = summary.totalAttendance || 0;
      const presentDays = summary.totalPresent || 0;
      const rating = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      return {
        ...summary,
        // Map to component-expected field names
        totalDays: totalDays,
        presentDays: presentDays,
        attendanceRating: rating,
        lateCount: summary.totalLate || 0,
        absentCount: summary.totalAbsent || 0,
        halfDayCount: summary.totalHalfDay || 0,
        avgWorkHours: summary.avgWorkHours || 0,
        totalWorkHours: summary.totalWorkHours || 0,
        // Keep original field names for backward compatibility
        rating,
        totalAttendance: totalDays,
        totalPresent: presentDays,
        totalAbsent: summary.totalAbsent || 0,
        totalLate: summary.totalLate || 0,
        totalHalfDay: summary.totalHalfDay || 0
      };
    });
  } catch (error) {
    // console.error('Error getting all teachers attendance summary:', error);
    throw error;
  }
};

export const getTeacherAttendanceSummaryById = async (teacherId) => {
  try {
    const db = getDatabaseInstance();
    const summary = await db.getFirstAsync(`
      SELECT 
        t.id,
        t.fullname,
        t.department,
        COUNT(a.id) as totalAttendance,
        SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as totalPresent,
        SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as totalAbsent,
        SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as totalLate,
        SUM(CASE WHEN a.status = 'Half Day' THEN 1 ELSE 0 END) as totalHalfDay,
        AVG(a.workHours) as avgWorkHours,
        SUM(a.workHours) as totalWorkHours,
        MIN(a.checkInTime) as bestCheckInTime,
        MAX(a.checkInTime) as worstCheckInTime,
        MAX(a.date) as lastAttendanceDate
      FROM teachers t
      LEFT JOIN attendance a ON t.id = a.teacherId
      WHERE t.id = ?
      GROUP BY t.id, t.fullname, t.department
    `, [teacherId]);
    
    if (summary) {
      const totalDays = summary.totalAttendance || 0;
      const presentDays = summary.totalPresent || 0;
      const rating = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      return {
        ...summary,
        // Map to component-expected field names
        totalDays: totalDays,
        presentDays: presentDays,
        attendanceRating: rating,
        lateCount: summary.totalLate || 0,
        absentCount: summary.totalAbsent || 0,
        halfDayCount: summary.totalHalfDay || 0,
        avgWorkHours: summary.avgWorkHours || 0,
        totalWorkHours: summary.totalWorkHours || 0,
        // Keep original field names for backward compatibility
        rating,
        totalAttendance: totalDays,
        totalPresent: presentDays,
        totalAbsent: summary.totalAbsent || 0,
        totalLate: summary.totalLate || 0,
        totalHalfDay: summary.totalHalfDay || 0
      };
    }
    
    return null;
  } catch (error) {
    // console.error('Error getting teacher attendance summary by ID:', error);
    throw error;
  }
};