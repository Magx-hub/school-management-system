// src/services/allowanceService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection reference
const COLLECTION_NAME = 'allowance_records';
const allowanceCollection = collection(db, COLLECTION_NAME);

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Calculate total JHS students
export const calculateTotalJHSStudents = (allowanceData) => {
  const { basic7JHS, basic8JHS, basic9JHS } = allowanceData;
  return (basic7JHS || 0) + (basic8JHS || 0) + (basic9JHS || 0);
};

// Calculate total general students
export const calculateTotalGeneralStudents = (allowanceData) => {
  const {
    creche, nursery1, nursery2, kg1, kg2,
    basic1, basic2, basic3, basic4, basic5, basic6,
    basic7General, basic8General, basic9General
  } = allowanceData;
  
  return (creche || 0) + (nursery1 || 0) + (nursery2 || 0) + (kg1 || 0) + (kg2 || 0) +
         (basic1 || 0) + (basic2 || 0) + (basic3 || 0) + (basic4 || 0) + (basic5 || 0) +
         (basic6 || 0) + (basic7General || 0) + (basic8General || 0) + (basic9General || 0);
};

// Validate allowance data
export const validateAllowanceData = (allowanceData) => {
  const errors = [];

  if (!allowanceData.weekNumber || allowanceData.weekNumber < 1 || allowanceData.weekNumber > 52) {
    errors.push('Week number must be between 1 and 52');
  }
  
  if (!allowanceData.numberOfTeachers || allowanceData.numberOfTeachers < 0) {
    errors.push('Number of teachers must be a positive number');
  }
  
  if (!allowanceData.numberOfJHSTeachers || allowanceData.numberOfJHSTeachers < 0) {
    errors.push('Number of JHS teachers must be a positive number');
  }
  
  if (!allowanceData.totalSum || allowanceData.totalSum <= 0) {
    errors.push('Total sum must be greater than 0');
  }
  
  return errors;
};

// Format currency for display
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

// Calculate allowance per teacher
export const calculateTeacherAllowance = (totalAmount, numberOfTeachers, deductions = 0) => {
  if (numberOfTeachers <= 0) return 0;
  const netAmount = totalAmount - deductions;
  return Math.max(0, netAmount / numberOfTeachers);
};

// Calculate total deductions
export const calculateTotalDeductions = (allowanceData) => {
  const { welfare, office, kitchen } = allowanceData;
  return (welfare || 0) + (office || 0) + (kitchen || 0);
};

// ===========================================
// BUSINESS LOGIC FUNCTIONS
// ===========================================

// Check if week already exists
export const weekExists = async (weekNumber) => {
  try {
    const q = query(allowanceCollection, where('weekNumber', '==', weekNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if week exists:', error);
    throw error;
  }
};

// Get allowance summary statistics
export const getAllowanceSummary = async () => {
  try {
    const querySnapshot = await getDocs(allowanceCollection);
    const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (records.length === 0) {
      return {
        totalRecords: 0,
        avgTotalSum: 0,
        maxTotalSum: 0,
        minTotalSum: 0,
        avgTeacherAllowance: 0,
        avgJHSTeacherAllowance: 0
      };
    }
    
    const totalRecords = records.length;
    const totalSums = records.map(r => r.totalSum || 0);
    const teacherAllowances = records.map(r => r.eachTeacher || 0);
    const jhsTeacherAllowances = records.map(r => r.eachJHSTeacher || 0);
    
    return {
      totalRecords,
      avgTotalSum: totalSums.reduce((a, b) => a + b, 0) / totalRecords,
      maxTotalSum: Math.max(...totalSums),
      minTotalSum: Math.min(...totalSums),
      avgTeacherAllowance: teacherAllowances.reduce((a, b) => a + b, 0) / totalRecords,
      avgJHSTeacherAllowance: jhsTeacherAllowances.reduce((a, b) => a + b, 0) / totalRecords
    };
  } catch (error) {
    console.error('Error getting allowance summary:', error);
    throw error;
  }
};

// Get records within week range
export const getAllowanceRecordsByRange = async (startWeek, endWeek) => {
  try {
    const q = query(
      allowanceCollection, 
      where('weekNumber', '>=', startWeek),
      where('weekNumber', '<=', endWeek),
      orderBy('weekNumber', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting records by range:', error);
    throw error;
  }
};

// ===========================================
// ENHANCED CRUD OPERATIONS
// ===========================================

export const addAllowanceRecord = async (allowanceData) => {
  try {
    // Validate data first
    const validationErrors = validateAllowanceData(allowanceData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    // Check if week already exists
    const exists = await weekExists(allowanceData.weekNumber);
    if (exists) {
      throw new Error(`Record for week ${allowanceData.weekNumber} already exists`);
    }
    
    const recordData = {
      ...allowanceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(allowanceCollection, recordData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw error;
  }
};

export const getAllowanceRecords = async (limitCount = null, lastDoc = null) => {
  try {
    let q = query(allowanceCollection, orderBy('weekNumber', 'desc'));
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    return {
      records,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error getting calculations:', error);
    throw error;
  }
};

export const getAllowanceRecordByWeek = async (weekNumber) => {
  try {
    const q = query(allowanceCollection, where('weekNumber', '==', weekNumber));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting allowance record by week:', error);
    throw error;
  }
};

export const getAllowanceRecordById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting allowance record by ID:', error);
    throw error;
  }
};

export const updateAllowanceRecord = async (id, allowanceData) => {
  try {
    // Validate data first
    const validationErrors = validateAllowanceData(allowanceData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...allowanceData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating allowance record:', error);
    throw error;
  }
};

export const deleteAllowanceRecord = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting allowance record:', error);
    throw error;
  }
};

// ===========================================
// REPORTING FUNCTIONS
// ===========================================

// Get welfare records with week number, welfare amount, and date paid
export const getWelfareRecords = async (limitCount = null, lastDoc = null) => {
  try {
    let q = query(
      allowanceCollection,
      where('welfare', '>', 0),
      orderBy('weekNumber', 'desc')
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    
    const welfareRecords = querySnapshot.docs.map(doc => {
      const data = doc.data();
      let datePaid = 'N/A';
      
      if (data.createdAt && data.createdAt.toDate) {
        try {
          const date = data.createdAt.toDate();
          datePaid = date.toLocaleDateString();
        } catch (e) {
          console.log('Error parsing date:', data.createdAt, e);
        }
      }
      
      return {
        id: doc.id,
        weekNumber: data.weekNumber,
        welfare: data.welfare,
        datePaid
      };
    });
    
    return {
      records: welfareRecords,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error getting welfare records:', error);
    throw error;
  }
};

// Generate weekly report
export const generateWeeklyReport = async (weekNumber) => {
  try {
    const record = await getAllowanceRecordByWeek(weekNumber);
    if (!record) return null;
    
    const totalJHSStudents = calculateTotalJHSStudents(record);
    const totalGeneralStudents = calculateTotalGeneralStudents(record);
    const totalDeductions = calculateTotalDeductions(record);
    
    return {
      ...record,
      totalJHSStudents,
      totalGeneralStudents,
      totalDeductions,
      formattedTotalSum: formatCurrency(record.totalSum),
      formattedEachTeacher: formatCurrency(record.eachTeacher),
      formattedEachJHSTeacher: formatCurrency(record.eachJHSTeacher)
    };
  } catch (error) {
    console.error('Error generating weekly report:', error);
    throw error;
  }
};

// Export all functions as default
export default {
  calculateTotalJHSStudents,
  calculateTotalGeneralStudents,
  validateAllowanceData,
  formatCurrency,
  calculateTeacherAllowance,
  calculateTotalDeductions,
  weekExists,
  getAllowanceSummary,
  getAllowanceRecordsByRange,
  addAllowanceRecord,
  getAllowanceRecords,
  getAllowanceRecordByWeek,
  getAllowanceRecordById,
  updateAllowanceRecord,
  deleteAllowanceRecord,
  getWelfareRecords,
  generateWeeklyReport
};

