import React, { useState } from 'react';
import { useAllowance } from '../hooks/useAllowance';
import './Calculator.css'; // We'll create this CSS file

const Calculator = () => {
  const [weekNumber, setWeekNumber] = useState('');
  const [classes, setClasses] = useState({
    creche: '',
    nursery1: '',
    nursery2: '',
    kg1: '',
    kg2: '',
    basic1: '',
    basic2: '',
    basic3: '',
    basic4: '',
    basic5: '',
    basic6: '',
    basic7General: '',
    basic7JHS: '',
    basic8General: '',
    basic8JHS: '',
    basic9General: '',
    basic9JHS: '',
  });
  const [numberOfTeachers, setNumberOfTeachers] = useState('');
  const [numberOfJHSTeachers, setNumberOfJHSTeachers] = useState('');
  const [result, setResult] = useState(null);
  const [fadeAnim, setFadeAnim] = useState(1);
  const { addAllowance, loading, error } = useAllowance();

  const classLabels = {
    creche: 'Creche',
    nursery1: 'Nursery 1',
    nursery2: 'Nursery 2',
    kg1: 'KG 1',
    kg2: 'KG 2',
    basic1: 'Basic 1',
    basic2: 'Basic 2',
    basic3: 'Basic 3',
    basic4: 'Basic 4',
    basic5: 'Basic 5',
    basic6: 'Basic 6',
    basic7General: 'Basic 7 (General)',
    basic7JHS: 'Basic 7 (JHS)',
    basic8General: 'Basic 8 (General)',
    basic8JHS: 'Basic 8 (JHS)',
    basic9General: 'Basic 9 (General)',
    basic9JHS: 'Basic 9 (JHS)',
  };

  const calculate = () => {
    // Validation
    if (!weekNumber || parseInt(weekNumber) < 1 || parseInt(weekNumber) > 16) {
      alert('Error: Please enter a valid week number (1-16)');
      return;
    }
    if (!numberOfTeachers || parseInt(numberOfTeachers) <= 0) {
      alert('Error: Please enter a valid number of teachers');
      return;
    }
    if (!numberOfJHSTeachers || parseInt(numberOfJHSTeachers) <= 0) {
      alert('Error: Please enter a valid number of JHS teachers');
      return;
    }

    // Convert all class values to numbers
    const classValues = {};
    for (const [key, value] of Object.entries(classes)) {
      classValues[key] = parseFloat(value) || 0;
    }

    // ✅ CORRECTED: Only General classes go into main fund
    const generalClasses = [
      'creche',
      'nursery1',
      'nursery2',
      'kg1',
      'kg2',
      'basic1',
      'basic2',
      'basic3',
      'basic4',
      'basic5',
      'basic6',
      'basic7General',
      'basic8General',
      'basic9General',
    ];

    const totalSum = generalClasses.reduce(
      (sum, key) => sum + classValues[key],
      0
    );

    const welfare = 100;
    const balanceAfterWelfare = totalSum - welfare;
    const office = balanceAfterWelfare * 0.05;
    const balanceAfterOffice = balanceAfterWelfare - office;
    const kitchen = balanceAfterOffice * 0.05;
    const balanceAfterKitchen = balanceAfterOffice - kitchen;
    const eachTeacher = balanceAfterKitchen / parseInt(numberOfTeachers);

    // JHS-specific calculation
    const jhsTeachersClasses = classValues.basic7JHS + classValues.basic8JHS + classValues.basic9JHS;
    const eachJHSTeacher = jhsTeachersClasses / parseInt(numberOfJHSTeachers);

    const calculationResult = {
      weekNumber: parseInt(weekNumber),
      classes: classValues,
      numberOfTeachers: parseInt(numberOfTeachers),
      numberOfJHSTeachers: parseInt(numberOfJHSTeachers),
      totalSum,
      welfare,
      balanceAfterWelfare,
      office,
      balanceAfterOffice,
      kitchen,
      balanceAfterKitchen,
      eachTeacher,
      jhsTeachersClasses,
      eachJHSTeacher,
    };

    setResult(calculationResult);
    saveCalculation(calculationResult);

    // Simple fade animation
    setFadeAnim(0);
    setTimeout(() => setFadeAnim(1), 10);
  };

  const saveCalculation = async (calculation) => {
    try {
      // Flatten the classes object into individual properties for database storage
      const flatCalculation = {
        ...calculation,
        creche: calculation.classes.creche,
        nursery1: calculation.classes.nursery1,
        nursery2: calculation.classes.nursery2,
        kg1: calculation.classes.kg1,
        kg2: calculation.classes.kg2,
        basic1: calculation.classes.basic1,
        basic2: calculation.classes.basic2,
        basic3: calculation.classes.basic3,
        basic4: calculation.classes.basic4,
        basic5: calculation.classes.basic5,
        basic6: calculation.classes.basic6,
        basic7General: calculation.classes.basic7General,
        basic7JHS: calculation.classes.basic7JHS,
        basic8General: calculation.classes.basic8General,
        basic8JHS: calculation.classes.basic8JHS,
        basic9General: calculation.classes.basic9General,
        basic9JHS: calculation.classes.basic9JHS,
      };
      
      // Remove the classes object since we've flattened it
      delete flatCalculation.classes;
      
      const savedId = await addAllowance(flatCalculation);
      if (savedId) {
        alert('Success: Calculation saved successfully!');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      alert(`Error: Failed to save calculation: ${error.message}`);
    }
  };

  const clearForm = () => {
    setWeekNumber('');
    setClasses({
      creche: '',
      nursery1: '',
      nursery2: '',
      kg1: '',
      kg2: '',
      basic1: '',
      basic2: '',
      basic3: '',
      basic4: '',
      basic5: '',
      basic6: '',
      basic7General: '',
      basic7JHS: '',
      basic8General: '',
      basic8JHS: '',
      basic9General: '',
      basic9JHS: '',
    });
    setNumberOfTeachers('');
    setNumberOfJHSTeachers('');
    setResult(null);
  };

  const updateClass = (key, value) => {
    setClasses(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="calculator-container">
      <div className="calculator-scroll">
        {/* Week Number */}
        <div className="section">
          <h2 className="section-title">Week Information</h2>
          <div className="input-container">
            <label className="input-label">Week Number (1-16)</label>
            <input
              className="text-input"
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              type="number"
              placeholder="Enter week number"
            />
          </div>
        </div>

        {/* Class Amounts */}
        <div className="section">
          <h2 className="section-title">Class Amounts (GH₵)</h2>
          {Object.entries(classLabels).map(([key, label]) => (
            <div key={key} className="input-container">
              <label className="input-label">{label}</label>
              <input
                className="text-input"
                value={classes[key]}
                onChange={(e) => updateClass(key, e.target.value)}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* Teachers */}
        <div className="section">
          <h2 className="section-title">Teachers</h2>
          <div className="input-container">
            <label className="input-label">Number of Teachers</label>
            <input
              className="text-input"
              value={numberOfTeachers}
              onChange={(e) => setNumberOfTeachers(e.target.value)}
              type="number"
              placeholder="Enter number of teachers"
            />
          </div>
          <div className="input-container">
            <label className="input-label">Number of JHS Teachers</label>
            <input
              className="text-input"
              value={numberOfJHSTeachers}
              onChange={(e) => setNumberOfJHSTeachers(e.target.value)}
              type="number"
              placeholder="Enter number of JHS teachers"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="vertical-buttons">
          <button 
            className="button button-primary full-width-button" 
            onClick={calculate}
            disabled={loading}
          >
            <span className="button-icon">🧮</span>
            {loading ? 'Calculating...' : 'Calculate Results'}
          </button>
          
          <button 
            className="button button-secondary full-width-button clear-button-top-margin" 
            onClick={clearForm}
          >
            <span className="button-icon">🔄</span>
            Reset Form
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="result-section" style={{ opacity: fadeAnim }}>
            <h2 className="section-title">Calculation Results</h2>
            
            <div className="card">
              <h3 className="result-title">Week {result.weekNumber} Summary</h3>
              <div className="divider"></div>
              <div className="result-row">
                <span className="result-label">Total Sum:</span>
                <span className="result-value">GH₵{result.totalSum.toFixed(2)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Welfare Deduction:</span>
                <span className="result-value">-GH₵{result.welfare.toFixed(2)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Office (5%):</span>
                <span className="result-value">-GH₵{result.office.toFixed(2)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Kitchen (5%):</span>
                <span className="result-value">-GH₵{result.kitchen.toFixed(2)}</span>
              </div>
              <div className="result-row final-row">
                <span className="result-label-bold">Balance After Deductions:</span>
                <span className="final-value">GH₵{result.balanceAfterKitchen.toFixed(2)}</span>
              </div>
            </div>

            <div className="card">
              <h3 className="result-title">Per Teacher Breakdown</h3>
              <div className="divider"></div>
              <div className="result-row">
                <span className="result-label">Each Teacher ({result.numberOfTeachers} total):</span>
                <span className="final-value">GH₵{result.eachTeacher.toFixed(2)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">JHS Classes Total:</span>
                <span className="result-value">GH₵{result.jhsTeachersClasses.toFixed(2)}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Each JHS Teacher ({result.numberOfJHSTeachers} total):</span>
                <span className="final-value">GH₵{result.eachJHSTeacher.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {error && <p className="error-message">Error: {error}</p>}
      </div>
    </div>
  );
};

export default Calculator;