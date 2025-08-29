import React, { useState, useEffect, useMemo } from 'react';
import { useStudents, useStudentSearch, useStudentStats } from '../hooks/useStudents';
import './Students.css';

const Students = () => {
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const { searchResults, searching, searchStudents, clearSearch } = useStudentSearch();
  const { departmentStats, loading: statsLoading } = useStudentStats();

  // Local state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    fullname: '',
    department: '',
    gender: ''
  });

  // Get unique departments for filter dropdown
  const departments = useMemo(() => {
    const depts = [...new Set(students.map(student => student.department))].filter(Boolean);
    return depts.sort();
  }, [students]);

  // Filter and search logic
  const displayStudents = useMemo(() => {
    let filtered = searchTerm ? searchResults : students;

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(student => student.department === selectedDepartment);
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(student => student.gender === selectedGender);
    }

    return filtered;
  }, [students, searchResults, searchTerm, selectedDepartment, selectedGender]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim()) {
      searchStudents(searchTerm);
    } else {
      clearSearch();
    }
  }, [searchTerm, searchStudents, clearSearch]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      fullname: '',
      department: '',
      gender: ''
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await addStudent(formData.fullname, formData.department, formData.gender);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to add student:', err);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(editingStudent.id, formData.fullname, formData.department, formData.gender);
      setShowEditModal(false);
      setEditingStudent(null);
      resetForm();
    } catch (err) {
      console.error('Failed to update student:', err);
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will also delete their attendance records.`)) {
      try {
        await deleteStudent(id);
      } catch (err) {
        console.error('Failed to delete student:', err);
      }
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      fullname: student.fullname,
      department: student.department,
      gender: student.gender
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingStudent(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="students-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="students-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Students Management</h1>
        <button 
          className="action-button action-button-primary"
          onClick={() => setShowAddModal(true)}
        >
          <span className="action-button-text">Add Student</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{students.length}</div>
          <div className="stat-label">Total Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{departments.length}</div>
          <div className="stat-label">Departments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.filter(s => s.gender === 'Male').length}
          </div>
          <div className="stat-label">Male</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.filter(s => s.gender === 'Female').length}
          </div>
          <div className="stat-label">Female</div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search students by name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searching && <div className="search-spinner"></div>}
        </div>

        <div className="filter-section">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {(searchTerm || selectedDepartment !== 'all' || selectedGender !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedDepartment('all');
                setSelectedGender('all');
                clearSearch();
              }}
              className="clear-filters-btn"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Students Table */}
      <div className="table-container">
        {displayStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">
              {searchTerm || selectedDepartment !== 'all' || selectedGender !== 'all' 
                ? 'No students found' 
                : 'No students yet'
              }
            </div>
            <div className="empty-subtitle">
              {searchTerm || selectedDepartment !== 'all' || selectedGender !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Add your first student to get started'
              }
            </div>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr className="table-header">
                <th className="table-header-text">Name</th>
                <th className="table-header-text">Department</th>
                <th className="table-header-text">Gender</th>
                <th className="table-header-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((student) => (
                <tr key={student.id} className="table-row">
                  <td className="table-cell">
                    <span className="table-cell-text">{student.fullname}</span>
                  </td>
                  <td className="table-cell">
                    <span className="table-cell-text">{student.department}</span>
                  </td>
                  <td className="table-cell">
                    <span className="table-cell-text">{student.gender}</span>
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(student)}
                        className="action-button action-button-primary"
                      >
                        <span className="action-button-text">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.fullname)}
                        className="action-button action-button-danger"
                      >
                        <span className="action-button-text">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Student</h2>
              <button className="modal-close" onClick={closeModals}>&times;</button>
            </div>
            
            <form onSubmit={handleAddStudent} className="student-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeModals} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Student</h2>
              <button className="modal-close" onClick={closeModals}>&times;</button>
            </div>
            
            <form onSubmit={handleEditStudent} className="student-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={closeModals} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;