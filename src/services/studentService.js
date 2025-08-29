import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// ===========================================
// STUDENT CRUD OPERATIONS
// ===========================================

export const addStudent = async (fullname, department, gender) => {
  try {
    const studentData = {
      fullname,
      department,
      gender,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'students'), studentData);
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
    
    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return students;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const docRef = doc(db, 'students', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting student by ID:', error);
    throw error;
  }
};

export const updateStudent = async (id, fullname, department, gender) => {
  try {
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, {
      fullname,
      department,
      gender,
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
    // First delete related attendance records
    const attendanceQuery = query(
      collection(db, 'attendance'), 
      where('studentId', '==', id)
    );
    const attendanceSnapshot = await getDocs(attendanceQuery);
    
    // Delete all attendance records for this student
    const deletePromises = attendanceSnapshot.docs.map(attendanceDoc => 
      deleteDoc(doc(db, 'attendance', attendanceDoc.id))
    );
    await Promise.all(deletePromises);
    
    // Then delete the student
    await deleteDoc(doc(db, 'students', id));
    return true;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// ===========================================
// STUDENT BUSINESS LOGIC & UTILITIES
// ===========================================

export const getStudentsByDepartment = async (department) => {
  try {
    const q = query(
      collection(db, 'students'),
      where('department', '==', department),
      orderBy('fullname', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    const students = [];
    querySnapshot.forEach((doc) => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return students;
  } catch (error) {
    console.error('Error getting students by department:', error);
    throw error;
  }
};

export const searchStudents = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support SQL-like LIKE queries
    // We'll get all students and filter client-side for simplicity
    // For better performance with large datasets, consider using Algolia or similar
    const students = await getStudents();
    
    const filteredStudents = students.filter(student => 
      student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredStudents;
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export const getStudentStats = async () => {
  try {
    const students = await getStudents();
    const departments = new Set(students.map(student => student.department));
    
    return {
      totalStudents: students.length,
      totalDepartments: departments.size
    };
  } catch (error) {
    console.error('Error getting student statistics:', error);
    throw error;
  }
};

export const getDepartmentStats = async () => {
  try {
    const students = await getStudents();
    const departmentCounts = {};
    
    students.forEach(student => {
      const dept = student.department;
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const stats = Object.entries(departmentCounts)
      .map(([department, studentCount]) => ({
        department,
        studentCount
      }))
      .sort((a, b) => b.studentCount - a.studentCount);

    return stats;
  } catch (error) {
    console.error('Error getting department statistics:', error);
    throw error;
  }
};

export const getGenderStats = async () => {
  try {
    const students = await getStudents();
    const genderCounts = {};
    
    students.forEach(student => {
      const gender = student.gender;
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    const stats = Object.entries(genderCounts)
      .map(([gender, count]) => ({
        gender,
        count
      }))
      .sort((a, b) => b.count - a.count);

    return stats;
  } catch (error) {
    console.error('Error getting gender statistics:', error);
    throw error;
  }
};

export const getStudentSummary = async () => {
  try {
    const students = await getStudents();
    const departments = new Set(students.map(student => student.department));
    
    const maleCount = students.filter(student => student.gender === 'Male').length;
    const femaleCount = students.filter(student => student.gender === 'Female').length;

    return {
      totalStudents: students.length,
      maleCount,
      femaleCount,
      totalDepartments: departments.size
    };
  } catch (error) {
    console.error('Error getting student summary:', error);
    throw error;
  }
};