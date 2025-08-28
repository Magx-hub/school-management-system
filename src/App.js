import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import { COLORS, SIZES, FONTS, SHADOWS } from './constants/theme';

// Mobile-friendly placeholder components
const PlaceholderPage = ({ title, description }) => (
  <div style={{
    padding: SIZES.padding,
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusMd,
    ...SHADOWS.small,
    marginTop: SIZES.padding * 2,
  }}>
    <h1 style={{
      fontSize: SIZES.h2,
      fontWeight: FONTS.bold,
      color: COLORS.textPrimary,
      marginBottom: SIZES.margin,
      fontFamily: FONTS.fontFamily,
    }}>{title}</h1>
    <p style={{
      fontSize: SIZES.default,
      color: COLORS.textSecondary,
      fontFamily: FONTS.fontFamily,
      lineHeight: 1.6,
    }}>{description}</p>
  </div>
);

const Attendance = () => (
  <PlaceholderPage 
    title="Attendance Management" 
    description="Track daily attendance for teachers and students. Features include bulk attendance marking, attendance reports, and absence notifications."
  />
);

const Allowance = () => (
  <PlaceholderPage 
    title="Allowance Management" 
    description="Calculate and manage teacher allowances, overtime payments, and other financial compensations with detailed reporting."
  />
);

const Students = () => (
  <PlaceholderPage 
    title="Students Management" 
    description="Manage student records, class assignments, academic performance tracking, and parent communication."
  />
);

const Canteen = () => (
  <PlaceholderPage 
    title="Canteen Management" 
    description="Track canteen sales, manage inventory, handle payments, and generate sales reports for the school canteen."
  />
);

const Settings = () => (
  <PlaceholderPage 
    title="Settings" 
    description="Configure system preferences, manage user accounts, customize notifications, and adjust application settings."
  />
);

function App() {
  return (
    <Router>
      <div className="App">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/allowance" element={<Allowance />} />
            <Route path="/students" element={<Students />} />
            <Route path="/canteen" element={<Canteen />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
        
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: COLORS.white,
              color: COLORS.textPrimary,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              maxWidth: '90vw',
              wordBreak: 'break-word',
            },
            success: {
              iconTheme: {
                primary: COLORS.success,
                secondary: COLORS.white,
              },
            },
            error: {
              iconTheme: {
                primary: COLORS.error,
                secondary: COLORS.white,
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
