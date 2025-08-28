import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { useTeachers } from '../hooks/useTeachers';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import toast from 'react-hot-toast';

const Teachers = () => {
  const { teachers, loading, error, addTeacher, updateTeacher, deleteTeacher, searchTeachers } = useTeachers();
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    department: ''
  });

  const DEPARTMENTS = [
    'Creche', 'Nursery', 'Kindergarten', 'Basic 1', 'Basic 2', 'Basic 3',
    'Basic 4', 'Basic 5', 'Basic 6', 'Basic 7', 'Basic 8', 'Basic 9'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullname.trim() || !formData.department.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingTeacher) {
        await updateTeacher(editingTeacher.id, formData);
        toast.success('Teacher updated successfully');
      } else {
        await addTeacher(formData);
        toast.success('Teacher added successfully');
      }
      
      setShowForm(false);
      setEditingTeacher(null);
      setFormData({ fullname: '', department: '' });
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      fullname: teacher.fullname,
      department: teacher.department
    });
    setShowForm(true);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.fullname}?`)) {
      try {
        await deleteTeacher(teacher.id);
        toast.success('Teacher deleted successfully');
      } catch (error) {
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchTeachers(term);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTeacher(null);
    setFormData({ fullname: '', department: '' });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Teachers Management</h1>
        <button 
          style={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          <FiPlus size={20} />
          Add Teacher
        </button>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchInput}>
          <FiSearch size={20} color={COLORS.gray} />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={handleSearch}
            style={styles.input}
          />
        </div>
      </div>

      {/* Teacher Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
              </h2>
              <button style={styles.closeButton} onClick={resetForm}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  style={styles.input}
                  placeholder="Enter teacher's full name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  style={styles.select}
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formActions}>
                <button type="button" style={styles.cancelButton} onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  {editingTeacher ? 'Update' : 'Add Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teachers List */}
      <div style={styles.teachersList}>
        {loading ? (
          <div style={styles.loading}>Loading teachers...</div>
        ) : error ? (
          <div style={styles.error}>Error: {error}</div>
        ) : teachers.length === 0 ? (
          <div style={styles.empty}>
            <p>No teachers found</p>
            <button style={styles.addButton} onClick={() => setShowForm(true)}>
              Add your first teacher
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {teachers.map((teacher) => (
              <div key={teacher.id} style={styles.teacherCard}>
                <div style={styles.teacherInfo}>
                  <h3 style={styles.teacherName}>{teacher.fullname}</h3>
                  <p style={styles.teacherDepartment}>{teacher.department}</p>
                </div>
                <div style={styles.teacherActions}>
                  <button 
                    style={styles.actionButton}
                    onClick={() => handleEdit(teacher)}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button 
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => handleDelete(teacher)}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: SIZES.marginSm,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: SIZES.borderRadius,
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
    cursor: 'pointer',
    fontFamily: FONTS.fontFamily,
    transition: 'background-color 0.2s ease',
  },
  searchContainer: {
    marginBottom: SIZES.padding * 2,
  },
  searchInput: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    border: `1px solid ${COLORS.border}`,
    ...SHADOWS.small,
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: SIZES.default,
    fontFamily: FONTS.fontFamily,
    marginLeft: SIZES.marginSm,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.padding * 2,
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto',
    ...SHADOWS.large,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  modalTitle: {
    fontSize: SIZES.h4,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: COLORS.gray,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: SIZES.padding,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: SIZES.marginSm,
  },
  label: {
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
    color: COLORS.textPrimary,
    fontFamily: FONTS.fontFamily,
  },
  select: {
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: SIZES.borderRadius,
    fontSize: SIZES.default,
    fontFamily: FONTS.fontFamily,
    backgroundColor: COLORS.white,
  },
  formActions: {
    display: 'flex',
    gap: SIZES.margin,
    marginTop: SIZES.padding,
  },
  cancelButton: {
    flex: 1,
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    border: `1px solid ${COLORS.border}`,
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.white,
    color: COLORS.textPrimary,
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
    cursor: 'pointer',
    fontFamily: FONTS.fontFamily,
  },
  submitButton: {
    flex: 1,
    padding: `${SIZES.paddingSm}px ${SIZES.padding}px`,
    border: 'none',
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: SIZES.default,
    fontWeight: FONTS.medium,
    cursor: 'pointer',
    fontFamily: FONTS.fontFamily,
  },
  teachersList: {
    marginTop: SIZES.padding * 2,
  },
  loading: {
    textAlign: 'center',
    padding: SIZES.padding * 2,
    color: COLORS.textSecondary,
    fontFamily: FONTS.fontFamily,
  },
  error: {
    textAlign: 'center',
    padding: SIZES.padding * 2,
    color: COLORS.error,
    fontFamily: FONTS.fontFamily,
  },
  empty: {
    textAlign: 'center',
    padding: SIZES.padding * 2,
    color: COLORS.textSecondary,
    fontFamily: FONTS.fontFamily,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: SIZES.margin,
  },
  teacherCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.padding,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
    border: `1px solid ${COLORS.border}`,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: SIZES.h5,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
  },
  teacherDepartment: {
    fontSize: SIZES.default,
    color: COLORS.textSecondary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  teacherActions: {
    display: 'flex',
    gap: SIZES.marginSm,
  },
  actionButton: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: SIZES.borderRadius,
    backgroundColor: COLORS.grayLight,
    color: COLORS.textPrimary,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },
};

export default Teachers;
