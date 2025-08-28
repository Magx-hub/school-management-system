// src/components/AllowanceForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, Calculator as CalcIcon, AlertCircle } from 'lucide-react';
import { 
  calculateTotalJHSStudents, 
  calculateTotalGeneralStudents,
  calculateTotalDeductions,
  calculateTeacherAllowance,
  formatCurrency
} from '../services/allowanceService';

const AllowanceForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    weekNumber: '',
    // Student counts
    creche: 0,
    nursery1: 0,
    nursery2: 0,
    kg1: 0,
    kg2: 0,
    basic1: 0,
    basic2: 0,
    basic3: 0,
    basic4: 0,
    basic5: 0,
    basic6: 0,
    basic7General: 0,
    basic7JHS: 0,
    basic8General: 0,
    basic8JHS: 0,
    basic9General: 0,
    basic9JHS: 0,
    // Teacher counts
    numberOfTeachers: '',
    numberOfJHSTeachers: '',
    // Financial data
    totalSum: '',
    welfare: 0,
    balanceAfterWelfare: 0,
    office: 0,
    balanceAfterOffice: 0,
    kitchen: 0,
    balanceAfterKitchen: 0,
    eachTeacher: 0,
    jhsTeachersClasses: 0,
    eachJHSTeacher: 0,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({
    totalJHSStudents: 0,
    totalGeneralStudents: 0,
    totalStudents: 0,
    totalDeductions: 0
  });

  // Calculate derived values whenever form data changes
  useEffect(() => {
    const totalJHS = calculateTotalJHSStudents(formData);
    const totalGeneral = calculateTotalGeneralStudents(formData);
    const totalDeductions = calculateTotalDeductions(formData);

    setCalculatedValues({
      totalJHSStudents: totalJHS,
      totalGeneralStudents: totalGeneral,
      totalStudents: totalJHS + totalGeneral,
      totalDeductions
    });

    // Auto-calculate balances and allowances
    const totalSum = parseFloat(formData.totalSum) || 0;
    const welfare = parseFloat(formData.welfare) || 0;
    const office = parseFloat(formData.office) || 0;
    const kitchen = parseFloat(formData.kitchen) || 0;

    const balanceAfterWelfare = totalSum - welfare;
    const balanceAfterOffice = balanceAfterWelfare - office;
    const balanceAfterKitchen = balanceAfterOffice - kitchen;

    const numberOfTeachers = parseInt(formData.numberOfTeachers) || 0;
    const numberOfJHSTeachers = parseInt(formData.numberOfJHSTeachers) || 0;

    const eachTeacher = numberOfTeachers > 0 ? balanceAfterKitchen / numberOfTeachers : 0;
    const eachJHSTeacher = numberOfJHSTeachers > 0 ? balanceAfterKitchen / numberOfJHSTeachers : 0;

    setFormData(prev => ({
      ...prev,
      balanceAfterWelfare,
      balanceAfterOffice,
      balanceAfterKitchen,
      eachTeacher,
      eachJHSTeacher
    }));
  }, [
    formData.totalSum,
    formData.welfare,
    formData.office,
    formData.kitchen,
    formData.numberOfTeachers,
    formData.numberOfJHSTeachers,
    formData.creche,
    formData.nursery1,
    formData.nursery2,
    formData.kg1,
    formData.kg2,
    formData.basic1,
    formData.basic2,
    formData.basic3,
    formData.basic4,
    formData.basic5,
    formData.basic6,
    formData.basic7General,
    formData.basic7JHS,
    formData.basic8General,
    formData.basic8JHS,
    formData.basic9General,
    formData.basic9JHS
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.weekNumber || formData.weekNumber < 1 || formData.weekNumber > 52) {
      newErrors.weekNumber = 'Week number must be between 1 and 52';
    }

    if (!formData.numberOfTeachers || formData.numberOfTeachers < 1) {
      newErrors.numberOfTeachers = 'Number of teachers must be at least 1';
    }

    if (!formData.numberOfJHSTeachers || formData.numberOfJHSTeachers < 0) {
      newErrors.numberOfJHSTeachers = 'Number of JHS teachers must be 0 or more';
    }

    if (!formData.totalSum || formData.totalSum <= 0) {
      newErrors.totalSum = 'Total sum must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {initialData ? 'Edit Allowance Record' : 'Add New Allowance Record'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Week Number *
              </label>
              <input
                type="number"
                name="weekNumber"
                min="1"
                max="52"
                value={formData.weekNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.weekNumber ? 'border-red-300' : ''
                }`}
                required
              />
              {errors.weekNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.weekNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Sum (GHS) *
              </label>
              <input
                type="number"
                name="totalSum"
                step="0.01"
                min="0"
                value={formData.totalSum}
                onChange={handleInputChange}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.totalSum ? 'border-red-300' : ''
                }`}
                required
              />
              {errors.totalSum && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.totalSum}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Teachers *
              </label>
              <input
                type="number"
                name="numberOfTeachers"
                min="1"
                value={formData.numberOfTeachers}
                onChange={handleInputChange}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.numberOfTeachers ? 'border-red-300' : ''
                }`}
                required
              />
              {errors.numberOfTeachers && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.numberOfTeachers}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of JHS Teachers
              </label>
              <input
                type="number"
                name="numberOfJHSTeachers"
                min="0"
                value={formData.numberOfJHSTeachers}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Student Counts */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Student Enrollment</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {/* Early Years */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Creche</label>
                <input
                  type="number"
                  name="creche"
                  min="0"
                  value={formData.creche}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nursery 1</label>
                <input
                  type="number"
                  name="nursery1"
                  min="0"
                  value={formData.nursery1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nursery 2</label>
                <input
                  type="number"
                  name="nursery2"
                  min="0"
                  value={formData.nursery2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">KG 1</label>
                <input
                  type="number"
                  name="kg1"
                  min="0"
                  value={formData.kg1}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">KG 2</label>
                <input
                  type="number"
                  name="kg2"
                  min="0"
                  value={formData.kg2}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Primary */}
              {[1, 2, 3, 4, 5, 6].map(grade => (
                <div key={`basic${grade}`}>
                  <label className="block text-sm font-medium text-gray-700">Basic {grade}</label>
                  <input
                    type="number"
                    name={`basic${grade}`}
                    min="0"
                    value={formData[`basic${grade}`]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              ))}

              {/* JHS */}
              {[7, 8, 9].map(grade => (
                <React.Fragment key={`basic${grade}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Basic {grade} General</label>
                    <input
                      type="number"
                      name={`basic${grade}General`}
                      min="0"
                      value={formData[`basic${grade}General`]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Basic {grade} JHS</label>
                    <input
                      type="number"
                      name={`basic${grade}JHS`}
                      min="0"
                      value={formData[`basic${grade}JHS`]}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Deductions</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Welfare (GHS)</label>
                <input
                  type="number"
                  name="welfare"
                  step="0.01"
                  min="0"
                  value={formData.welfare}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Office (GHS)</label>
                <input
                  type="number"
                  name="office"
                  step="0.01"
                  min="0"
                  value={formData.office}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kitchen (GHS)</label>
                <input
                  type="number"
                  name="kitchen"
                  step="0.01"
                  min="0"
                  value={formData.kitchen}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Calculated Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <CalcIcon className="w-5 h-5 mr-2" />
              Calculated Values
            </h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-lg font-semibold">{calculatedValues.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">JHS Students</p>
                <p className="text-lg font-semibold">{calculatedValues.totalJHSStudents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Each Teacher</p>
                <p className="text-lg font-semibold">{formatCurrency(formData.eachTeacher)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Each JHS Teacher</p>
                <p className="text-lg font-semibold">{formatCurrency(formData.eachJHSTeacher)}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllowanceForm;