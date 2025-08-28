import React, { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiSearch, FiPlus, FiSave } from 'react-icons/fi';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useAttendance } from '../hooks/useAttendance';
import { useTeachers } from '../hooks/useTeachers';
import { generatePdf } from '../utils/pdfGenerator';

const Attendance = () => {
  const { records, loading, error, loadByDate, saveRecord, updateRecord, stats, getWeekNumber } = useAttendance();
  const { teachers } = useTeachers();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ teacherId: '', checkInTime: '', checkOutTime: '', status: '', remarks: '' });

  useEffect(() => { loadByDate(date); }, [date, loadByDate]);

  const filtered = useMemo(() => {
    if (!search) return records;
    const q = search.toLowerCase();
    return records.filter(r => (r.fullname || '').toLowerCase().includes(q) || (r.department || '').toLowerCase().includes(q));
  }, [records, search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.teacherId) return;
    await saveRecord({ ...form, date });
    setForm({ teacherId: '', checkInTime: '', checkOutTime: '', status: '', remarks: '' });
  };

  const handleExport = async () => {
    const filters = { reportType: 'all', startDate: date, endDate: date };
    await generatePdf(filtered, filters);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Attendance</h1>
        <div style={styles.headerActions}>
          <div style={styles.dateInputWrap}>
            <FiCalendar size={18} color={COLORS.gray} />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.dateInput} />
          </div>
          <div style={styles.searchWrap}>
            <FiSearch size={18} color={COLORS.gray} />
            <input placeholder="Search by name or department" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
          </div>
          <button onClick={handleExport} style={styles.secondaryBtn}><FiSave size={16} />Export</button>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.leftPane}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Mark Attendance</h2>
            <form onSubmit={handleAdd} style={styles.form}>
              <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} style={styles.select} required>
                <option value="">Select teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.fullname}</option>)}
              </select>
              <div style={styles.row2}>
                <input type="time" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} style={styles.input} placeholder="Check-in" />
                <input type="time" value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })} style={styles.input} placeholder="Check-out" />
              </div>
              <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} style={styles.input} placeholder="Remarks (optional)" />
              <button type="submit" style={styles.primaryBtn}><FiPlus size={18} />Save Attendance</button>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Today&apos;s Records</h2>
            {loading ? (
              <div style={styles.muted}>Loading...</div>
            ) : error ? (
              <div style={styles.error}>Error: {error}</div>
            ) : (
              <div style={styles.tableWrap}>
                <div style={styles.tableHeader}>
                  <div style={{flex: 2}}>Teacher</div>
                  <div style={{flex: 1}}>Department</div>
                  <div style={{flex: 1}}>Check-in</div>
                  <div style={{flex: 1}}>Check-out</div>
                  <div style={{flex: 1}}>Hours</div>
                  <div style={{flex: 1}}>Status</div>
                </div>
                {filtered.map(r => (
                  <div key={r.id} style={styles.tableRow}>
                    <div style={{flex: 2}}>{r.fullname}</div>
                    <div style={{flex: 1}}>{r.department}</div>
                    <div style={{flex: 1}}>{r.checkInTime || '-'}</div>
                    <div style={{flex: 1}}>{r.checkOutTime || '-'}</div>
                    <div style={{flex: 1}}>{(r.workHours || 0).toFixed(2)}</div>
                    <div style={{flex: 1}}>{r.status}</div>
                  </div>
                ))}
                {filtered.length === 0 && <div style={styles.muted}>No records</div>}
              </div>
            )}
          </div>
        </div>

        <div style={styles.rightPane}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Daily Stats</h2>
            <div style={styles.kpiGrid}>
              <KPI label="Total" value={stats.daily.totalRecords} />
              <KPI label="Present" value={stats.daily.presentCount} />
              <KPI label="Absent" value={stats.daily.absentCount} />
              <KPI label="Late" value={stats.daily.lateCount} />
              <KPI label="Half Day" value={stats.daily.halfDayCount} />
              <KPI label="Avg Hours" value={stats.daily.avgWorkHours} />
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Week Number</h2>
            <div style={styles.muted}>Week {getWeekNumber(date)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KPI = ({ label, value }) => (
  <div style={styles.kpiItem}>
    <div style={styles.kpiValue}>{value}</div>
    <div style={styles.kpiLabel}>{label}</div>
  </div>
);

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.padding * 2 },
  title: { fontSize: SIZES.h2, fontWeight: FONTS.bold, color: COLORS.textPrimary, margin: 0, fontFamily: FONTS.fontFamily },
  headerActions: { display: 'flex', gap: SIZES.margin, alignItems: 'center' },
  dateInputWrap: { display: 'flex', alignItems: 'center', background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: SIZES.borderRadius, padding: '8px 12px', ...SHADOWS.small },
  dateInput: { border: 'none', outline: 'none', marginLeft: 8 },
  searchWrap: { display: 'flex', alignItems: 'center', background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: SIZES.borderRadius, padding: '8px 12px', ...SHADOWS.small },
  searchInput: { border: 'none', outline: 'none', marginLeft: 8 },
  contentGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: SIZES.margin },
  leftPane: { display: 'flex', flexDirection: 'column', gap: SIZES.margin },
  rightPane: { display: 'flex', flexDirection: 'column', gap: SIZES.margin },
  card: { background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: SIZES.borderRadiusMd, padding: SIZES.padding, ...SHADOWS.small },
  sectionTitle: { margin: 0, marginBottom: SIZES.margin, fontSize: SIZES.h4, fontWeight: FONTS.bold, color: COLORS.accent },
  form: { display: 'flex', flexDirection: 'column', gap: SIZES.marginSm },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SIZES.marginSm },
  select: { padding: '10px 12px', borderRadius: SIZES.borderRadius, border: `1px solid ${COLORS.border}` },
  input: { padding: '10px 12px', borderRadius: SIZES.borderRadius, border: `1px solid ${COLORS.border}` },
  primaryBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', borderRadius: SIZES.borderRadius, background: COLORS.primary, color: COLORS.white, border: 'none' },
  secondaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 12px', borderRadius: SIZES.borderRadius, background: COLORS.white, color: COLORS.textPrimary, border: `1px solid ${COLORS.border}` },
  tableWrap: { width: '100%' },
  tableHeader: { display: 'flex', padding: '10px 12px', background: COLORS.grayLight, borderRadius: SIZES.borderRadius, color: COLORS.textSecondary, fontWeight: FONTS.medium },
  tableRow: { display: 'flex', padding: '12px', borderBottom: `1px solid ${COLORS.border}` },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: SIZES.marginSm },
  kpiItem: { background: COLORS.grayLight, borderRadius: SIZES.borderRadius, padding: '12px', textAlign: 'center' },
  kpiValue: { fontSize: SIZES.h4, fontWeight: FONTS.bold, color: COLORS.textPrimary },
  kpiLabel: { fontSize: SIZES.default, color: COLORS.textSecondary },
  muted: { color: COLORS.textSecondary },
  error: { color: COLORS.error },
  '@media (max-width: 768px)': {},
};

export default Attendance;


