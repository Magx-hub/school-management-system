import { useState, useCallback, useEffect } from 'react';
import * as firebaseService from '../services/firebaseService';

export const useTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalTeachers: 0, totalDepartments: 0 });

  const handleAsync = useCallback(async (asyncFunction) => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFunction();
    } catch (err) {
      console.error('Database operation error:', err);
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    const data = await handleAsync(firebaseService.getTeachers);
    if (data) {
      setTeachers(data);
    }
  }, [handleAsync]);

  const addTeacher = useCallback(async (teacherData) => {
    const newTeacherId = await handleAsync(() => 
      firebaseService.addTeacher(teacherData)
    );
    if (newTeacherId) {
      await fetchTeachers(); // Refresh the list
    }
    return newTeacherId;
  }, [handleAsync, fetchTeachers]);

  const updateTeacher = useCallback(async (id, teacherData) => {
    const success = await handleAsync(() => 
      firebaseService.updateTeacher(id, teacherData)
    );
    if (success) {
      await fetchTeachers(); // Refresh the list
    }
    return success;
  }, [handleAsync, fetchTeachers]);

  const deleteTeacher = useCallback(async (id) => {
    const success = await handleAsync(() => 
      firebaseService.deleteTeacher(id)
    );
    if (success) {
      setTeachers(prev => prev.filter(t => t.id !== id));
    }
    return success;
  }, [handleAsync]);

  const searchTeachers = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      await fetchTeachers();
      return;
    }
    
    const data = await handleAsync(() => 
      firebaseService.searchTeachers(searchTerm)
    );
    if (data) {
      setTeachers(data);
    }
  }, [handleAsync, fetchTeachers]);

  const fetchTeacherStats = useCallback(async () => {
    const data = await handleAsync(firebaseService.getTeacherStats);
    if (data) {
      setStats(data);
    }
  }, [handleAsync]);

  useEffect(() => {
    fetchTeachers();
    fetchTeacherStats();
  }, [fetchTeachers, fetchTeacherStats]);

  return {
    teachers,
    loading,
    error,
    stats,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    fetchTeacherStats,
  };
};
