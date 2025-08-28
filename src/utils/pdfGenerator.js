// Web/PWA PDF generation via print dialog

export const generatePdf = async (records, filters) => {
  // Generate report title based on type
  const getReportTitle = () => {
    switch (filters.reportType) {
      case 'all':
        return 'All Teachers Attendance Report';
      case 'teacher':
        return 'Individual Teacher Attendance Report';
      case 'week':
        return 'Weekly Attendance Report';
      default:
        return 'Teacher Attendance Report';
    }
  };

  // Generate filter info based on type
  const getFilterInfo = () => {
    let info = '';
    
    if (filters.startDate && filters.endDate && filters.startDate !== 'N/A') {
      info += `<p><strong>Date Range:</strong> ${filters.startDate} to ${filters.endDate}</p>`;
    }
    
    if (filters.teacherId && records[0]?.fullname) {
      info += `<p><strong>Teacher:</strong> ${records[0].fullname}</p>`;
    }
    
    if (filters.weekNum) {
      info += `<p><strong>Week:</strong> ${filters.weekNum}</p>`;
    }
    
    return info;
  };

  // Generate table headers based on report type
  const getTableHeaders = () => {
    if (filters.reportType === 'week') {
      return `
        <tr>
          <th>Teacher</th>
          <th>Department</th>
          <th>Days Tracked</th>
          <th>Present Days</th>
          <th>Total Work Hours</th>
          <th>Average Hours</th>
        </tr>
      `;
    }
    
    return `
      <tr>
        <th>Teacher</th>
        <th>Department</th>
        <th>Date</th>
        <th>Check-In</th>
        <th>Check-Out</th>
        <th>Work Hours</th>
        <th>Status</th>
      </tr>
    `;
  };

  // Generate table rows based on report type
  const getTableRows = () => {
    if (filters.reportType === 'week') {
      return records.map(record => `
        <tr>
          <td>${record.fullname}</td>
          <td>${record.department}</td>
          <td>${record.daysTracked || 0}</td>
          <td>${record.presentDays || 0}</td>
          <td>${record.totalWorkHours ? `${record.totalWorkHours.toFixed(1)} hrs` : '-'}</td>
          <td>${record.avgWorkHours ? `${record.avgWorkHours.toFixed(1)} hrs` : '-'}</td>
        </tr>
      `).join('');
    }
    
    return records.map(record => `
      <tr>
        <td>${record.fullname}</td>
        <td>${record.department}</td>
        <td>${record.date}</td>
        <td>${record.checkInTime || '-'}</td>
        <td>${record.checkOutTime || '-'}</td>
        <td>${record.workHours > 0 ? `${record.workHours.toFixed(2)} hrs` : '-'}</td>
        <td>${record.status}</td>
      </tr>
    `).join('');
  };

  // Generate summary statistics
  const getSummaryStats = () => {
    if (filters.reportType === 'week') {
      const totalTeachers = records.length;
      const totalDaysTracked = records.reduce((sum, record) => sum + (record.daysTracked || 0), 0);
      const totalPresentDays = records.reduce((sum, record) => sum + (record.presentDays || 0), 0);
      const totalWorkHours = records.reduce((sum, record) => sum + (record.totalWorkHours || 0), 0);
      const avgWorkHours = totalDaysTracked > 0 ? totalWorkHours / totalDaysTracked : 0;
      const attendanceRate = totalDaysTracked > 0 ? Math.round((totalPresentDays / totalDaysTracked) * 100) : 0;

      return `
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #333;">Weekly Summary</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div><strong>Total Teachers:</strong> ${totalTeachers}</div>
            <div><strong>Total Days Tracked:</strong> ${totalDaysTracked}</div>
            <div><strong>Total Present Days:</strong> ${totalPresentDays}</div>
            <div><strong>Total Work Hours:</strong> ${totalWorkHours.toFixed(1)} hrs</div>
            <div><strong>Average Work Hours:</strong> ${avgWorkHours.toFixed(1)} hrs</div>
            <div><strong>Attendance Rate:</strong> ${attendanceRate}%</div>
          </div>
        </div>
      `;
    }

    const totalRecords = records.length;
    const presentCount = records.filter(record => record.status === 'Present').length;
    const absentCount = records.filter(record => record.status === 'Absent').length;
    const lateCount = records.filter(record => record.status === 'Late').length;
    const halfDayCount = records.filter(record => record.status === 'Half Day').length;
    const totalWorkHours = records.reduce((sum, record) => sum + (record.workHours || 0), 0);
    const avgWorkHours = totalRecords > 0 ? totalWorkHours / totalRecords : 0;
    const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

    return `
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #333;">Report Summary</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div><strong>Total Records:</strong> ${totalRecords}</div>
          <div><strong>Present:</strong> ${presentCount}</div>
          <div><strong>Absent:</strong> ${absentCount}</div>
          <div><strong>Late:</strong> ${lateCount}</div>
          <div><strong>Half Day:</strong> ${halfDayCount}</div>
          <div><strong>Total Work Hours:</strong> ${totalWorkHours.toFixed(1)} hrs</div>
          <div><strong>Average Work Hours:</strong> ${avgWorkHours.toFixed(1)} hrs</div>
          <div><strong>Attendance Rate:</strong> ${attendanceRate}%</div>
        </div>
      </div>
    `;
  };

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; }
          .container { max-width: 1200px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #333; text-align: center; margin-bottom: 30px; font-size: 28px; }
          h3 { color: #333; margin-bottom: 15px; }
          .header { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; }
          .filter-info { margin-bottom: 20px; font-size: 14px; color: #555; }
          .filter-info p { margin: 8px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: 600; color: #495057; }
          tr:nth-child(even) { background-color: #f8f9fa; }
          tr:hover { background-color: #e9ecef; }
          .summary-section { margin-top: 30px; }
          .footer { margin-top: 40px; text-align: right; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getReportTitle()}</h1>
            <div class="filter-info">
              ${getFilterInfo()}
            </div>
          </div>
          
          <table>
            <thead>
              ${getTableHeaders()}
            </thead>
            <tbody>
              ${getTableRows()}
            </tbody>
          </table>
          
          <div class="summary-section">
            ${getSummaryStats()}
          </div>
          
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Records: ${records.length}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Open a new window and trigger the print dialog (user can save as PDF)
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) return null;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  // Delay to ensure content renders before print
  setTimeout(() => {
    printWindow.print();
  }, 300);
  return true;
};