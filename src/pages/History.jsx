import React, { useState, useEffect } from 'react';
import './History.css';
import { STYLES } from '../utils/designUtils';

const useAllowance = () => {
  const [loading, setLoading] = useState(false);
  const [allowances, setAllowances] = useState([]);
  const [welfareRecords, setWelfareRecords] = useState([]);

  // Mock API calls
  const fetchAllowances = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAllowances([
      {
        id: '1',
        weekNumber: 1,
        createdAt: '2025-08-20T10:00:00Z',
        totalSum: 500.75,
        numberOfTeachers: 10,
        eachTeacher: 50.08,
        creche: 50,
        nursery1: 50,
        nursery2: 50,
        kg1: 50,
        kg2: 50,
        basic1: 50,
        basic2: 50,
        basic3: 50,
        basic4: 50,
        basic5: 50,
        basic6: 50,
        basic7General: 0,
        basic7JHS: 0,
        basic8General: 0,
        basic8JHS: 0,
        basic9General: 0,
        basic9JHS: 0,
        welfare: 25.5,
        office: 25.5,
        kitchen: 25.5,
        balanceAfterKitchen: 424.25,
      },
      {
        id: '2',
        weekNumber: 2,
        createdAt: '2025-08-27T10:00:00Z',
        totalSum: 620.50,
        numberOfTeachers: 12,
        eachTeacher: 51.71,
        creche: 60,
        nursery1: 60,
        nursery2: 60,
        kg1: 60,
        kg2: 60,
        basic1: 60,
        basic2: 60,
        basic3: 60,
        basic4: 60,
        basic5: 60,
        basic6: 60,
        basic7General: 0,
        basic7JHS: 0,
        basic8General: 0,
        basic8JHS: 0,
        basic9General: 0,
        basic9JHS: 0,
        welfare: 31.025,
        office: 31.025,
        kitchen: 31.025,
        balanceAfterKitchen: 527.425,
      },
    ]);
    setLoading(false);
    return allowances;
  };

  const fetchWelfareRecords = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setWelfareRecords([
      { weekNumber: 1, welfare: 25.5, datePaid: '2025-08-20' },
      { weekNumber: 2, welfare: 31.025, datePaid: '2025-08-27' },
    ]);
    setLoading(false);
    return welfareRecords;
  };

  const deleteAllowance = async (id) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAllowances(prev => prev.filter(a => a.id !== id));
    setLoading(false);
    return true;
  };

  return {
    fetchWelfareRecords,
    fetchAllowances,
    deleteAllowance,
    loading,
    allowances,
    welfareRecords
  };
};

export default function AllowanceHistory() {
  const [activeTab, setActiveTab] = useState('history');
  const [selectedCalculation, setSelectedCalculation] = useState(null);
  const { fetchWelfareRecords, fetchAllowances, deleteAllowance, loading, allowances, welfareRecords } = useAllowance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await fetchAllowances();
      await fetchWelfareRecords();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const deleteCalculation = (calculationToDelete) => {
    if (window.confirm(`Are you sure you want to delete Week ${calculationToDelete.weekNumber} calculation? This action cannot be undone.`)) {
      deleteAllowance(calculationToDelete.id)
        .then(success => {
          if (success) {
            setSelectedCalculation(null);
            alert('Success', 'Calculation deleted successfully');
          } else {
            alert('Error', 'Failed to delete calculation');
          }
        })
        .catch(error => {
          console.error('Error deleting calculation:', error);
          alert('Error', 'Failed to delete calculation');
        });
    }
  };

  const handleEdit = (calculation) => {
    alert('Edit functionality would be implemented here. This would navigate to an edit screen.');
  };

  const renderTableHeader = () => (
    <div className={`${STYLES.tableHeader} table-row-flex`}>
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableHeaderText}>Week</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-2`}>
        <span className={STYLES.tableHeaderText}>Date</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1_5`}>
        <span className={STYLES.tableHeaderText}>Amount</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableHeaderText}>Teachers</span>
      </div>
    </div>
  );

  const renderCalculationItem = (item) => (
    <div
      key={item.id}
      className={`${STYLES.tableRow} ${selectedCalculation?.id === item.id ? 'selected-row' : ''}`}
      onClick={() => {
        const newSelection = selectedCalculation?.id === item.id ? null : item;
        setSelectedCalculation(newSelection);
      }}
    >
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableCellText}>{item.weekNumber}</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-2`}>
        <span className={STYLES.tableCellText}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1_5`}>
        <span className={`${STYLES.tableCellText} text-success`}>₵{item.totalSum.toFixed(2)}</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableCellText}>{item.numberOfTeachers}</span>
      </div>
    </div>
  );

  const renderCalculationDetails = () => {
    if (!selectedCalculation) return null;

    return (
      <div className="details-panel">
        <div className="details-header">
          <h4 className="details-title">Week {selectedCalculation.weekNumber} Details</h4>
          <button className="close-details-button" onClick={() => setSelectedCalculation(null)}>
            &times;
          </button>
        </div>

        <div className="details-content">
          <div className="summary-section">
            <h5 className="section-title">Summary</h5>
            <div className="summary-row">
              <span className="summary-label">Total Amount:</span>
              <span className="summary-value">GH₵{selectedCalculation.totalSum?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Teachers:</span>
              <span className="summary-value">{selectedCalculation.numberOfTeachers || 0}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Per Teacher:</span>
              <span className="summary-value">GH₵{selectedCalculation.eachTeacher?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          <div className="detail-section">
            <h5 className="section-title">Class Amounts</h5>
            <div className="breakdown-table">
              {[
                { key: 'creche', label: 'Creche' },
                { key: 'nursery1', label: 'Nursery 1' },
                { key: 'nursery2', label: 'Nursery 2' },
                { key: 'kg1', label: 'KG 1' },
                { key: 'kg2', label: 'KG 2' },
                { key: 'basic1', label: 'Basic 1' },
                { key: 'basic2', label: 'Basic 2' },
                { key: 'basic3', label: 'Basic 3' },
                { key: 'basic4', label: 'Basic 4' },
                { key: 'basic5', label: 'Basic 5' },
                { key: 'basic6', label: 'Basic 6' },
                { key: 'basic7General', label: 'Basic 7 (General)' },
                { key: 'basic7JHS', label: 'Basic 7 (JHS)' },
                { key: 'basic8General', label: 'Basic 8 (General)' },
                { key: 'basic8JHS', label: 'Basic 8 (JHS)' },
                { key: 'basic9General', label: 'Basic 9 (General)' },
                { key: 'basic9JHS', label: 'Basic 9 (JHS)' },
              ].map(({ key, label }) => (
                <div key={key} className="breakdown-row">
                  <span className="breakdown-label">{label}</span>
                  <span className="breakdown-value">GH₵{(selectedCalculation[key] || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h5 className="section-title">Deductions</h5>
            <div className="breakdown-table">
              <div className="breakdown-row">
                <span className="breakdown-label">Welfare Deduction</span>
                <span className="breakdown-value text-error">-GH₵{selectedCalculation.welfare?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Office (5%)</span>
                <span className="breakdown-value text-error">-GH₵{selectedCalculation.office?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label">Kitchen (5%)</span>
                <span className="breakdown-value text-error">-GH₵{selectedCalculation.kitchen?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="breakdown-row total-row">
                <span className="total-label">Balance After Deductions</span>
                <span className="total-value">GH₵{selectedCalculation.balanceAfterKitchen?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="details-actions">
          <button className={`${STYLES.actionButton} ${STYLES.actionButtonPrimary}`} onClick={() => handleEdit(selectedCalculation)}>
            Edit
          </button>
          <button className={`${STYLES.actionButton} ${STYLES.actionButtonDanger}`} onClick={() => deleteCalculation(selectedCalculation)}>
            Delete
          </button>
        </div>
      </div>
    );
  };

  const renderWelfareTableHeader = () => (
    <div className={`${STYLES.tableHeader} table-row-flex`}>
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableHeaderText}>Week</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1_5`}>
        <span className={STYLES.tableHeaderText}>Welfare</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-2`}>
        <span className={STYLES.tableHeaderText}>Date Paid</span>
      </div>
    </div>
  );

  const renderWelfareItem = (item) => (
    <div key={item.weekNumber} className={STYLES.tableRow}>
      <div className={`${STYLES.tableCell} cell-flex-1`}>
        <span className={STYLES.tableCellText}>{item.weekNumber}</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-1_5`}>
        <span className={`${STYLES.tableCellText} text-success`}>₵{item.welfare.toFixed(2)}</span>
      </div>
      <div className={`${STYLES.tableCell} cell-flex-2`}>
        <span className={STYLES.tableCellText}>{item.datePaid}</span>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className={STYLES.tabContainer}>
      <button
        className={`${STYLES.tab} ${activeTab === 'history' ? STYLES.tabActive : ''}`}
        onClick={() => setActiveTab('history')}
      >
        <span className={`${STYLES.tabText} ${activeTab === 'history' ? STYLES.tabTextActive : ''}`}>History</span>
      </button>
      <button
        className={`${STYLES.tab} ${activeTab === 'welfares' ? STYLES.tabActive : ''}`}
        onClick={() => setActiveTab('welfares')}
      >
        <span className={`${STYLES.tabText} ${activeTab === 'welfares' ? STYLES.tabTextActive : ''}`}>Welfares</span>
      </button>
    </div>
  );

  const renderEmptyState = (type = 'calculations') => (
    <div className={STYLES.emptyState}>
      <span className="empty-icon">{type === 'welfares' ? '💰' : '📊'}</span>
      <h5 className={STYLES.emptyTitle}>
        {type === 'welfares' ? 'No Welfare Records Yet' : 'No Calculations Yet'}
      </h5>
      <p className={STYLES.emptySubtitle}>
        {type === 'welfares'
          ? 'Welfare records will appear here after calculations with welfare deductions are made'
          : 'Calculations will appear here after you create them using the Calculator'
        }
      </p>
    </div>
  );

  const renderTabContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (activeTab === 'history') {
      return (
        <>
          <div className="table-container">
            {allowances.length > 0 && renderTableHeader()}
            <div className="table-list">
              {allowances.length === 0 ? renderEmptyState('calculations') : allowances.map(renderCalculationItem)}
            </div>
          </div>
          {renderCalculationDetails()}
        </>
      );
    } else {
      return (
        <div className="table-container">
          {welfareRecords.length > 0 && renderWelfareTableHeader()}
          <div className="table-list">
            {welfareRecords.length === 0 ? renderEmptyState('welfares') : welfareRecords.map(renderWelfareItem)}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <div className={STYLES.header}>
        <h1 className={STYLES.headerTitle}>Calculation History</h1>
        <div className="header-stats">
          <span className="header-stats-text">
            {activeTab === 'history' ? `${allowances.length} records` : `${welfareRecords.length} welfare records`}
          </span>
        </div>
      </div>
      <div className="tabs-wrapper">
        {renderTabs()}
      </div>
      <div className="content-scroll">
        {renderTabContent()}
        <div className="bottom-spacing"></div>
      </div>
    </div>
  );
}