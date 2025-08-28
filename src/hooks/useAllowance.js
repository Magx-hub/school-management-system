// src/hooks/useAllowance.js
import { useState, useCallback, useEffect } from 'react';
import * as allowanceService from '../services/allowanceService';

export const useAllowance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allowances, setAllowances] = useState([]);
  const [summary, setSummary] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Generic async handler with loading and error states
  const handleAsync = useCallback(async (asyncFunction, showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      return await asyncFunction();
    } catch (err) {
      console.error('Async operation error:', err);
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Fetch allowances with pagination
  const fetchAllowances = useCallback(async (limitCount = 20, reset = false) => {
    const docToUse = reset ? null : lastDoc;
    
    const result = await handleAsync(() => 
      allowanceService.getAllowanceRecords(limitCount, docToUse)
    );
    
    if (result) {
      if (reset) {
        setAllowances(result.records);
      } else {
        setAllowances(prev => [...prev, ...result.records]);
      }
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    }
  }, [handleAsync, lastDoc]);

  // Load more allowances (pagination)
  const loadMoreAllowances = useCallback(async (limitCount = 20) => {
    if (!hasMore || loading) return;
    await fetchAllowances(limitCount, false);
  }, [fetchAllowances, hasMore, loading]);

  // Refresh allowances from the beginning
  const refreshAllowances = useCallback(async (limitCount = 20) => {
    setLastDoc(null);
    setHasMore(true);
    await fetchAllowances(limitCount, true);
  }, [fetchAllowances]);

  // Add new allowance record
  const addAllowance = useCallback(async (data) => {
    const newAllowanceId = await handleAsync(() => 
      allowanceService.addAllowanceRecord(data)
    );
    
    if (newAllowanceId) {
      // Refresh the list to show the new record
      await refreshAllowances();
      return newAllowanceId;
    }
    return null;
  }, [handleAsync, refreshAllowances]);

  // Update existing allowance record
  const updateAllowance = useCallback(async (id, data) => {
    const success = await handleAsync(() => 
      allowanceService.updateAllowanceRecord(id, data)
    );
    
    if (success) {
      // Update the local state
      setAllowances(prev => prev.map(allowance => 
        allowance.id === id ? { ...allowance, ...data } : allowance
      ));
    }
    return success;
  }, [handleAsync]);

  // Delete allowance record
  const deleteAllowance = useCallback(async (id) => {
    const success = await handleAsync(() => 
      allowanceService.deleteAllowanceRecord(id)
    );
    
    if (success) {
      setAllowances(prev => prev.filter(allowance => allowance.id !== id));
    }
    return success;
  }, [handleAsync]);

  // Get allowance record by week number
  const getByWeek = useCallback(async (weekNumber) => {
    return await handleAsync(() => 
      allowanceService.getAllowanceRecordByWeek(weekNumber), false
    );
  }, [handleAsync]);

  // Get allowance record by ID
  const getById = useCallback(async (id) => {
    return await handleAsync(() => 
      allowanceService.getAllowanceRecordById(id), false
    );
  }, [handleAsync]);

  // Get summary statistics
  const getSummary = useCallback(async () => {
    const data = await handleAsync(() => 
      allowanceService.getAllowanceSummary(), false
    );
    if (data) {
      setSummary(data);
    }
    return data;
  }, [handleAsync]);

  // Get welfare records
  const fetchWelfareRecords = useCallback(async (limitCount, lastDoc) => {
    return await handleAsync(() => 
      allowanceService.getWelfareRecords(limitCount, lastDoc), false
    );
  }, [handleAsync]);

  // Get records by week range
  const getRecordsByRange = useCallback(async (startWeek, endWeek) => {
    return await handleAsync(() => 
      allowanceService.getAllowanceRecordsByRange(startWeek, endWeek), false
    );
  }, [handleAsync]);

  // Generate weekly report
  const generateWeeklyReport = useCallback(async (weekNumber) => {
    return await handleAsync(() => 
      allowanceService.generateWeeklyReport(weekNumber), false
    );
  }, [handleAsync]);

  // Check if week exists
  const checkWeekExists = useCallback(async (weekNumber) => {
    return await handleAsync(() => 
      allowanceService.weekExists(weekNumber), false
    );
  }, [handleAsync]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchAllowances(20, true),
        getSummary()
      ]);
    };

    initializeData();
  }, []); // Empty dependency array for mount only

  return {
    // State
    loading,
    error,
    allowances,
    summary,
    hasMore,
    
    // CRUD operations
    addAllowance,
    updateAllowance,
    deleteAllowance,
    getById,
    getByWeek,
    
    // Data fetching
    fetchAllowances,
    refreshAllowances,
    loadMoreAllowances,
    getSummary,
    
    // Reports and analytics
    fetchWelfareRecords,
    getRecordsByRange,
    generateWeeklyReport,
    
    // Utilities
    checkWeekExists,
    clearError
  };
};

// Custom hook for managing a single allowance record
export const useAllowanceRecord = (id) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecord = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await allowanceService.getAllowanceRecordById(id);
      setRecord(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch record');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRecord();
  }, [fetchRecord]);

  return {
    record,
    loading,
    error,
    refetch: fetchRecord
  };
};

// Custom hook for welfare records with pagination
export const useWelfareRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchWelfareRecords = useCallback(async (limitCount = 10, reset = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const docToUse = reset ? null : lastDoc;
      const result = await allowanceService.getWelfareRecords(limitCount, docToUse);
      
      if (reset) {
        setRecords(result.records);
      } else {
        setRecords(prev => [...prev, ...result.records]);
      }
      
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message || 'Failed to fetch welfare records');
    } finally {
      setLoading(false);
    }
  }, [lastDoc]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchWelfareRecords(10, false);
  }, [fetchWelfareRecords, hasMore, loading]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchWelfareRecords(10, true);
  }, [fetchWelfareRecords]);

  useEffect(() => {
    fetchWelfareRecords(10, true);
  }, []);

  return {
    records,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};

export default useAllowance;