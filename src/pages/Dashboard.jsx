import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiBookOpen,
  FiTrendingUp,
  FiClock,
  FiCoffee
} from 'react-icons/fi';
import { useTeachers } from '../hooks/useTeachers';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { format } from 'date-fns';

const Dashboard = () => {
  const { stats: teacherStats } = useTeachers();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM do, yyyy');
  };

  const statsCards = [
    {
      icon: FiUsers,
      value: teacherStats?.totalTeachers || 0,
      label: 'Teachers',
      subtext: 'Active staff',
      color: COLORS.primary,
      borderColor: COLORS.primary,
    },
    {
      icon: FiCalendar,
      value: '92%',
      label: 'Attendance',
      subtext: 'This week',
      color: COLORS.success,
      borderColor: COLORS.success,
    },
    {
      icon: FiBookOpen,
      value: teacherStats?.totalDepartments || 0,
      label: 'Classes',
      subtext: 'Active classes',
      color: COLORS.info,
      borderColor: COLORS.info,
    },
    {
      icon: FiDollarSign,
      value: 'GH₵2.4K',
      label: 'Allowance',
      subtext: 'This month',
      color: COLORS.warning,
      borderColor: COLORS.warning,
    },
  ];

  const quickActions = [
    {
      icon: FiUsers,
      label: 'Add Teacher',
      description: 'Register new teacher',
      color: COLORS.primary,
    },
    {
      icon: FiCalendar,
      label: 'Mark Attendance',
      description: 'Record daily attendance',
      color: COLORS.success,
    },
    {
      icon: FiDollarSign,
      label: 'Calculate Allowance',
      description: 'Weekly allowance calculation',
      color: COLORS.warning,
    },
    {
      icon: FiCoffee,
      label: 'Canteen Payment',
      description: 'Record canteen payments',
      color: COLORS.info,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome Back!</h1>
          <p style={styles.welcomeSubtitle}>{formatDate(currentTime)}</p>
          <p style={styles.welcomeTime}>{formatTime(currentTime)}</p>
        </div>
        <div style={styles.notificationButton}>
          <FiTrendingUp size={24} color={COLORS.primary} />
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsContainer}>
        <h2 style={styles.sectionTitle}>Overview</h2>
        <div style={styles.statsGrid}>
          {statsCards.map((card, index) => (
            <div key={index} style={{ ...styles.statCard, borderLeftColor: card.borderColor }}>
              <card.icon size={28} color={card.color} />
              <h3 style={styles.statValue}>{card.value}</h3>
              <p style={styles.statLabel}>{card.label}</p>
              <p style={styles.statSubtext}>{card.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionsContainer}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <div key={index} style={styles.quickActionCard}>
              <div style={{ ...styles.actionIcon, backgroundColor: action.color }}>
                <action.icon size={24} color={COLORS.white} />
              </div>
              <h3 style={styles.actionTitle}>{action.label}</h3>
              <p style={styles.actionDescription}>{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={styles.recentActivityContainer}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <FiUsers size={16} color={COLORS.primary} />
            </div>
            <div style={styles.activityContent}>
              <p style={styles.activityText}>New teacher registered: John Doe</p>
              <p style={styles.activityTime}>2 hours ago</p>
            </div>
          </div>
          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <FiCalendar size={16} color={COLORS.success} />
            </div>
            <div style={styles.activityContent}>
              <p style={styles.activityText}>Attendance marked for today</p>
              <p style={styles.activityTime}>4 hours ago</p>
            </div>
          </div>
          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <FiDollarSign size={16} color={COLORS.warning} />
            </div>
            <div style={styles.activityContent}>
              <p style={styles.activityText}>Allowance calculated for Week 3</p>
              <p style={styles.activityTime}>1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding * 2,
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    ...SHADOWS.small,
  },
  welcomeTitle: {
    fontSize: SIZES.h2,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
  },
  welcomeSubtitle: {
    fontSize: SIZES.h5,
    color: COLORS.textSecondary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
  },
  welcomeTime: {
    fontSize: SIZES.default,
    color: COLORS.primary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
    fontWeight: FONTS.medium,
  },
  notificationButton: {
    backgroundColor: COLORS.white,
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
    border: `1px solid ${COLORS.border}`,
  },
  statsContainer: {
    marginBottom: SIZES.padding * 2,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: FONTS.bold,
    color: COLORS.accent,
    marginBottom: SIZES.margin,
    fontFamily: FONTS.fontFamily,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SIZES.margin,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.padding,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    borderLeft: `4px solid`,
    ...SHADOWS.small,
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: FONTS.bold,
    margin: `${SIZES.marginSm}px 0`,
    color: COLORS.textPrimary,
    fontFamily: FONTS.fontFamily,
  },
  statLabel: {
    fontSize: SIZES.h5,
    color: COLORS.textSecondary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
    fontWeight: FONTS.medium,
  },
  statSubtext: {
    fontSize: SIZES.default,
    color: COLORS.textSecondary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  quickActionsContainer: {
    marginBottom: SIZES.padding * 2,
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: SIZES.margin,
  },
  quickActionCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    padding: SIZES.padding,
    textAlign: 'center',
    ...SHADOWS.small,
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    marginBottom: SIZES.margin,
  },
  actionTitle: {
    fontSize: SIZES.h5,
    fontWeight: FONTS.bold,
    color: COLORS.textPrimary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
  },
  actionDescription: {
    fontSize: SIZES.default,
    color: COLORS.textSecondary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
  recentActivityContainer: {
    marginBottom: SIZES.padding * 2,
  },
  activityList: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    ...SHADOWS.small,
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: COLORS.grayLight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.margin,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: SIZES.default,
    color: COLORS.textPrimary,
    margin: 0,
    marginBottom: SIZES.marginSm,
    fontFamily: FONTS.fontFamily,
    fontWeight: FONTS.medium,
  },
  activityTime: {
    fontSize: SIZES.default,
    color: COLORS.textSecondary,
    margin: 0,
    fontFamily: FONTS.fontFamily,
  },
};

export default Dashboard;
