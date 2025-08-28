// src/components/AllowanceList.jsx
import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Users, Calendar, DollarSign, MoreVertical } from 'lucide-react';
import { formatCurrency } from '../services/allowanceService';
import LoadingSpinner from './LoadingSpinner';

const AllowanceList = ({ 
  allowances, 
  loading, 
  onEdit, 
  onDelete, 
  onView, 
  hasMore, 
  onLoadMore 
}) => {
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const handleActionClick = (recordId) => {
    setActionMenuOpen(actionMenuOpen === recordId ? null : recordId);
  };

  const handleEdit = (record) => {
    setActionMenuOpen(null);
    onEdit(record);
  };

  const handleDelete = (record) => {
    setActionMenuOpen(null);
    if (window.confirm(`Are you sure you want to delete the record for week ${record.weekNumber}?`)) {
      onDelete(record.id);
    }
  };

  const handleView = (record) => {
    setActionMenuOpen(null);
    onView(record);
  };

  if (loading && allowances.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (allowances.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No allowance records</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first allowance calculation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Allowance Records
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Manage and view all allowance calculations
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {allowances.map((record) => (
            <div
              key={record.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">
                    Week {record.weekNumber}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => handleActionClick(record.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {actionMenuOpen === record.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleView(record)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </button>
                      </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      {/* Summary Info */}
                                      <div className="mb-2">
                                        <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                                          <span>
                                            <DollarSign className="inline h-4 w-4 mr-1 text-green-500" />
                                            {formatCurrency(record.totalSum)}
                                          </span>
                                          <span>
                                            <Users className="inline h-4 w-4 mr-1 text-blue-500" />
                                            Teachers: {record.numberOfTeachers}
                                          </span>
                                          <span>
                                            Students: {record.totalStudents ?? (record.totalJHSStudents + record.totalGeneralStudents)}
                                          </span>
                                        </div>
                                      </div>
                                      {/* Calculated Values */}
                                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                        <div>Each Teacher: {formatCurrency(record.eachTeacher)}</div>
                                        <div>Each JHS Teacher: {formatCurrency(record.eachJHSTeacher)}</div>
                                        <div>Welfare: {formatCurrency(record.welfare)}</div>
                                        <div>Office: {formatCurrency(record.office)}</div>
                                        <div>Kitchen: {formatCurrency(record.kitchen)}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {hasMore && (
                                  <div className="mt-6 flex justify-center">
                                    <button
                                      onClick={onLoadMore}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                                    >
                                      Load More
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        };
                        
                        export default AllowanceList;