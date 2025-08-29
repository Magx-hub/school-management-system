import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import * as studentService from '../services/studentService';

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for students
  useEffect(() => {
    const q = query(collection(db, 'students'), orderBy('fullname', 'asc'));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const studentsData = [];
        querySnapshot.forEach((doc) => {
          studentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setStudents(studentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error listening to students:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add student
  const addStudent = useCallback(async (fullname, department, gender) => {
    try {
      setError(null);
      const id = await studentService.addStudent(fullname, department, gender);
      return id;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update student
  const updateStudent = useCallback(async (id, fullname, department, gender) => {
    try {
      setError(null);
      const success = await studentService.updateStudent(id, fullname, department, gender);
      return success;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete student
  const deleteStudent = useCallback(async (id) => {
    try {
      setError(null);
      const success = await studentService.deleteStudent(id);
      return success;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get student by ID
  const getStudentById = useCallback(async (id) => {
    try {
      setError(null);
      const student = await studentService.getStudentById(id);
      return student;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById
  };
};

export const useStudentsByDepartment = (department) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!department) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'students'),
      where('department', '==', department),
      orderBy('fullname', 'asc')
    );
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const studentsData = [];
        querySnapshot.forEach((doc) => {
          studentsData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setStudents(studentsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error listening to students by department:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [department]);

  return { students, loading, error };
};

export const useStudentSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const searchStudents = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      const results = await studentService.searchStudents(searchTerm.trim());
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    searching,
    error,
    searchStudents,
    clearSearch
  };
};

export const useStudentStats = () => {
  const [stats, setStats] = useState({
    studentStats: null,
    departmentStats: [],
    genderStats: [],
    summary: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [studentStats, departmentStats, genderStats, summary] = await Promise.all([
        studentService.getStudentStats(),
        studentService.getDepartmentStats(),
        studentService.getGenderStats(),
        studentService.getStudentSummary()
      ]);

      setStats({
        studentStats,
        departmentStats,
        genderStats,
        summary
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refresh stats when needed
  const refreshStats = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...stats,
    loading,
    error,
    refreshStats
  };
};