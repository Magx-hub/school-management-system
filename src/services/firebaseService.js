import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===========================================
// TEACHER CRUD OPERATIONS
// ===========================================

export const addTeacher = async (teacherData) => {
  try {
    const docRef = await addDoc(collection(db, 'teachers'), {
      ...teacherData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding teacher:', error);
    throw error;
  }
};

export const getTeachers = async () => {
  try {
    const q = query(collection(db, 'teachers'), orderBy('fullname', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting teachers:', error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const docRef = doc(db, 'teachers', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Teacher not found');
    }
  } catch (error) {
    console.error('Error getting teacher by ID:', error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const docRef = doc(db, 'teachers', id);
    await updateDoc(docRef, {
      ...teacherData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    // First delete related attendance records
    const attendanceQuery = query(collection(db, 'attendance'), where('teacherId', '==', id));
    const attendanceSnapshot = await getDocs(attendanceQuery);
    const deletePromises = attendanceSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then delete the teacher
    await deleteDoc(doc(db, 'teachers', id));
    return true;
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

export const searchTeachers = async (searchTerm) => {
  try {
    const q = query(
      collection(db, 'teachers'),
      where('fullname', '>=', searchTerm),
      where('fullname', '<=', searchTerm + '\uf8ff'),
      orderBy('fullname', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error searching teachers:', error);
    throw error;
  }
};

export const getTeacherStats = async () => {
  try {
    const teachersSnapshot = await getDocs(collection(db, 'teachers'));
    const teachers = teachersSnapshot.docs.map(doc => doc.data());
    
    const departments = [...new Set(teachers.map(teacher => teacher.department))];
    
    return {
      totalTeachers: teachers.length,
      totalDepartments: departments.length
    };
  } catch (error) {
    console.error('Error getting teacher statistics:', error);
    throw error;
  }
};

// ===========================================
// STUDENT CRUD OPERATIONS
// ===========================================

export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      ...studentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const getStudents = async () => {
  try {
    const q = query(collection(db, 'students'), orderBy('fullname', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const docRef = doc(db, 'students', id);
    await updateDoc(docRef, {
      ...studentData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    await deleteDoc(doc(db, 'students', id));
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// ===========================================
// ATTENDANCE OPERATIONS
// ===========================================

export const addAttendance = async (attendanceData) => {
  try {
    const docRef = await addDoc(collection(db, 'attendance'), {
      ...attendanceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding attendance:', error);
    throw error;
  }
};

export const getAttendanceByDate = async (date) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('date', '==', date),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting attendance by date:', error);
    throw error;
  }
};

export const getAttendanceByTeacher = async (teacherId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('teacherId', '==', teacherId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting attendance by teacher:', error);
    throw error;
  }
};

export const getAttendanceByDateRange = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting attendance by date range:', error);
    throw error;
  }
};

export const updateAttendance = async (id, attendanceData) => {
  try {
    const docRef = doc(db, 'attendance', id);
    await updateDoc(docRef, {
      ...attendanceData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

// ===========================================
// ALLOWANCE OPERATIONS
// ===========================================

export const addAllowanceCalculation = async (calculationData) => {
  try {
    const docRef = await addDoc(collection(db, 'allowance_calculations'), {
      ...calculationData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding allowance calculation:', error);
    throw error;
  }
};

export const getAllowanceCalculations = async () => {
  try {
    const q = query(collection(db, 'allowance_calculations'), orderBy('weekNumber', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting allowance calculations:', error);
    throw error;
  }
};

// ===========================================
// CANTEEN OPERATIONS
// ===========================================

export const addCanteenPayment = async (paymentData) => {
  try {
    const docRef = await addDoc(collection(db, 'canteen_payments'), {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding canteen payment:', error);
    throw error;
  }
};

export const getCanteenPayments = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'canteen_payments'),
      where('paymentDate', '>=', startDate),
      where('paymentDate', '<=', endDate),
      orderBy('paymentDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting canteen payments:', error);
    throw error;
  }
};

export const getCanteenStats = async (startDate, endDate) => {
  try {
    const payments = await getCanteenPayments(startDate, endDate);
    
    // Group by department
    const departmentStats = payments.reduce((acc, payment) => {
      const dept = payment.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { department: dept, totalAmount: 0, count: 0 };
      }
      acc[dept].totalAmount += payment.totalAmount || 0;
      acc[dept].count += 1;
      return acc;
    }, {});
    
    return Object.values(departmentStats);
  } catch (error) {
    console.error('Error getting canteen stats:', error);
    throw error;
  }
};
