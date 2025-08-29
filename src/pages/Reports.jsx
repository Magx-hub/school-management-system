import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { FaFilePdf, FaShare, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { useAllowance } from '../hooks/useAllowance';

export default function Reports() {
  const [calculations, setCalculations] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const { allowances, fetchAllowances } = useAllowance();

  useEffect(() => {
    loadCalculations();
  }, []);

  useEffect(() => {
    if (allowances.length > 0) {
      setCalculations(allowances.sort((a, b) => a.weekNumber - b.weekNumber));
    }
  }, [allowances]);

  const loadCalculations = async () => {
    try {
      await fetchAllowances();
    } catch (error) {
      console.error('Error loading calculations:', error);
      alert('Failed to load calculations');
    }
  };

  const toggleWeekSelection = (weekNumber) => {
    setSelectedWeeks(prev =>
      prev.includes(weekNumber)
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const selectAllWeeks = () => {
    if (selectedWeeks.length === calculations.length) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks(calculations.map(calc => calc.weekNumber));
    }
  };

  const generateHTMLReport = (selectedCalculations) => {
    const totalAmount = selectedCalculations.reduce((sum, calc) => sum + calc.totalSum, 0);
    const totalTeachers = selectedCalculations.reduce((sum, calc) => sum + calc.numberOfTeachers, 0);
    const averagePerWeek = totalAmount / selectedCalculations.length;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Friday Allowance Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .summary-item { display: inline-block; margin: 10px 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007AFF; color: white; }
            .amount { text-align: right; }
            .total-row { background-color: #f0f8ff; font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Friday Allowance Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary">
            <h2>Summary</h2>
            <div class="summary-item">
                <strong>Total Weeks:</strong> ${selectedCalculations.length}
            </div>
            <div class="summary-item">
                <strong>Total Amount:</strong> GH₵${totalAmount.toFixed(2)}
            </div>
            <div class="summary-item">
                <strong>Average per Week:</strong> GH₵${averagePerWeek.toFixed(2)}
            </div>
            <div class="summary-item">
                <strong>Total Teachers:</strong> ${totalTeachers}
            </div>
        </div>

        <h2>Weekly Breakdown</h2>
        <table>
            <thead>
                <tr>
                    <th>Week</th>
                    <th>Date</th>
                    <th class="amount">Total Sum</th>
                    <th class="amount">Welfare</th>
                    <th class="amount">Office</th>
                    <th class="amount">Kitchen</th>
                    <th class="amount">Balance</th>
                    <th>Teachers</th>
                    <th class="amount">Per Teacher</th>
                </tr>
            </thead>
            <tbody>
                ${selectedCalculations.map(calc => `
                    <tr>
                        <td>Week ${calc.weekNumber}</td>
                        <td>${(() => {
                          if (calc.createdAt) {
                            try {
                              const date = new Date(calc.createdAt);
                              if (!isNaN(date.getTime())) {
                                return date.toLocaleDateString();
                              }
                            } catch (e) {
                              console.log('Error parsing date:', calc.createdAt, e);
                            }
                          }
                          return 'N/A';
                        })()}</td>
                        <td class="amount">GH₵${calc.totalSum.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.welfare.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.office.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.kitchen.toFixed(2)}</td>
                        <td class="amount">GH₵${calc.balanceAfterKitchen.toFixed(2)}</td>
                        <td>${calc.numberOfTeachers}</td>
                        <td class="amount">GH₵${calc.eachTeacher.toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">TOTALS</td>
                    <td class="amount">GH₵${totalAmount.toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.welfare, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.office, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.kitchen, 0).toFixed(2)}</td>
                    <td class="amount">GH₵${selectedCalculations.reduce((sum, calc) => sum + calc.balanceAfterKitchen, 0).toFixed(2)}</td>
                    <td>${totalTeachers}</td>
                    <td class="amount">-</td>
                </tr>
            </tbody>
        </table>

        <div class="footer">
            <p>Generated by Friday Allowance Calculator</p>
        </div>
    </body>
    </html>
    `;
  };

  const generatePDFReport = async () => {
    if (selectedWeeks.length === 0) {
      alert('Please select at least one week to generate report');
      return;
    }

    try {
      const selectedCalculations = calculations.filter(calc =>
        selectedWeeks.includes(calc.weekNumber)
      );

      const html = generateHTMLReport(selectedCalculations);

      const opt = {
        margin: 1,
        filename: 'friday-allowance-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(html).save();
      alert('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    }
  };

  const shareTextReport = async () => {
    if (selectedWeeks.length === 0) {
      alert('Please select at least one week to share report');
      return;
    }

    try {
      const selectedCalculations = calculations.filter(calc =>
        selectedWeeks.includes(calc.weekNumber)
      );

      const totalAmount = selectedCalculations.reduce((sum, calc) => sum + calc.totalSum, 0);
      const totalTeachers = selectedCalculations.reduce((sum, calc) => sum + calc.numberOfTeachers, 0);

      let reportText = `FRIDAY ALLOWANCE REPORT\n`;
      reportText += `Generated: ${new Date().toLocaleDateString()}\n\n`;
      reportText += `SUMMARY:\n`;
      reportText += `Total Weeks: ${selectedCalculations.length}\n`;
      reportText += `Total Amount: GH₵${totalAmount.toFixed(2)}\n`;
      reportText += `Average per Week: GH₵${(totalAmount / selectedCalculations.length).toFixed(2)}\n`;
      reportText += `Total Teachers: ${totalTeachers}\n\n`;

      reportText += `WEEKLY BREAKDOWN:\n`;
      selectedCalculations.forEach(calc => {
        const weekDate = (() => {
          if (calc.createdAt) {
            try {
              const date = new Date(calc.createdAt);
              if (!isNaN(date.getTime())) {
                return date.toLocaleDateString();
              }
            } catch (e) {
              console.log('Error parsing date:', calc.createdAt, e);
            }
          }
          return 'N/A';
        })();

        reportText += `Week ${calc.weekNumber} (${weekDate}):\n`;
        reportText += `  Total: GH₵${calc.totalSum.toFixed(2)} | Balance: GH₵${calc.balanceAfterKitchen.toFixed(2)}\n`;
        reportText += `  Teachers: ${calc.numberOfTeachers} | Per Teacher: GH₵${calc.eachTeacher.toFixed(2)}\n\n`;
      });

      // Try to use Web Share API first
      if (navigator.share) {
        await navigator.share({
          title: 'Friday Allowance Report',
          text: reportText,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(reportText);
        alert('Report copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing report:', error);
      alert('Failed to share report');
    }
  };

  if (calculations.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📄</div>
        <h2 style={styles.emptyTitle}>No Data Available</h2>
        <p style={styles.emptySubtitle}>Create some calculations first to generate reports</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Generate Reports</h1>
          <p style={styles.headerSubtitle}>Select weeks to include in your report</p>
        </div>

        {/* Selection Controls */}
        <div style={styles.controlsContainer}>
          <button style={styles.selectAllButton} onClick={selectAllWeeks}>
            {selectedWeeks.length === calculations.length ? 'Deselect All' : 'Select All'}
          </button>
          <span style={styles.selectedCount}>
            {selectedWeeks.length} of {calculations.length} weeks selected
          </span>
        </div>

        {/* Week Selection */}
        <div style={styles.weekSelectionContainer}>
          {calculations.map((calc) => (
            <div
              key={calc.weekNumber}
              style={{
                ...styles.weekItem,
                ...(selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekItem)
              }}
              onClick={() => toggleWeekSelection(calc.weekNumber)}
            >
              <div style={styles.weekHeader}>
                <div style={styles.checkboxContainer}>
                  {selectedWeeks.includes(calc.weekNumber) ? (
                    <FaCheckSquare style={styles.checkbox} />
                  ) : (
                    <FaSquare style={styles.checkbox} />
                  )}
                  <span style={{
                    ...styles.weekNumber,
                    ...(selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText)
                  }}>
                    Week {calc.weekNumber}
                  </span>
                </div>
                <span style={{
                  ...styles.weekDate,
                  ...(selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText)
                }}>
                  {(() => {
                    if (calc.createdAt) {
                      try {
                        const date = new Date(calc.createdAt);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString();
                        }
                      } catch (e) {
                        console.log('Error parsing date:', calc.createdAt, e);
                      }
                    }
                    return 'N/A';
                  })()}
                </span>
              </div>
              <div style={styles.weekDetails}>
                <span style={{
                  ...styles.weekAmount,
                  ...(selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText)
                }}>
                  GH₵{calc.totalSum.toFixed(2)}
                </span>
                <span style={{
                  ...styles.weekTeachers,
                  ...(selectedWeeks.includes(calc.weekNumber) && styles.selectedWeekText)
                }}>
                  {calc.numberOfTeachers} Teachers
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Generate Buttons */}
        <div style={styles.buttonsContainer}>
          <button
            style={{...styles.generateButton, ...styles.pdfButton}}
            onClick={generatePDFReport}
          >
            <FaFilePdf style={styles.buttonIcon} />
            Generate PDF Report
          </button>

          <button
            style={{...styles.generateButton, ...styles.shareButton}}
            onClick={shareTextReport}
          >
            <FaShare style={styles.buttonIcon} />
            Share Text Report
          </button>
        </div>

        {/* Summary */}
        {selectedWeeks.length > 0 && (
          <div style={styles.summaryContainer}>
            <h3 style={styles.summaryTitle}>Selected Weeks Summary</h3>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Total Amount</div>
                <div style={styles.summaryValue}>
                  GH₵{calculations
                    .filter(calc => selectedWeeks.includes(calc.weekNumber))
                    .reduce((sum, calc) => sum + calc.totalSum, 0)
                    .toFixed(2)}
                </div>
              </div>
              <div style={styles.summaryItem}>
                <div style={styles.summaryLabel}>Average per Week</div>
                <div style={styles.summaryValue}>
                  GH₵{selectedWeeks.length > 0 ? (calculations
                    .filter(calc => selectedWeeks.includes(calc.weekNumber))
                    .reduce((sum, calc) => sum + calc.totalSum, 0) / selectedWeeks.length)
                    .toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F2F2F7',
    padding: '20px',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    backgroundColor: '#F2F2F7',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: '8px',
  },
  emptySubtitle: {
    fontSize: '16px',
    color: '#C7C7CC',
  },
  header: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: '8px',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#8E8E93',
    margin: 0,
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  selectAllButton: {
    backgroundColor: '#007AFF',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  selectedCount: {
    fontSize: '14px',
    color: '#8E8E93',
  },
  weekSelectionContainer: {
    marginBottom: '24px',
  },
  weekItem: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '8px',
    border: '2px solid transparent',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  selectedWeekItem: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  weekHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    color: '#007AFF',
    fontSize: '16px',
  },
  weekNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1C1C1E',
  },
  weekDate: {
    fontSize: '14px',
    color: '#8E8E93',
  },
  weekDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekAmount: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#007AFF',
  },
  weekTeachers: {
    fontSize: '14px',
    color: '#8E8E93',
  },
  selectedWeekText: {
    color: '#007AFF',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  generateButton: {
    flex: 1,
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  pdfButton: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  shareButton: {
    backgroundColor: '#34C759',
    color: 'white',
  },
  buttonIcon: {
    fontSize: '16px',
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1C1C1E',
  },
  summaryGrid: {
    display: 'flex',
    gap: '24px',
  },
  summaryItem: {
    flex: 1,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#8E8E93',
    marginBottom: '4px',
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#007AFF',
  },
};