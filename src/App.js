import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import { COLORS } from './constants/theme';

// Placeholder components for other pages
const Attendance = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Attendance Management</h1>
    <p>Coming soon...</p>
  </div>
);

const Allowance = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Allowance Management</h1>
    <p>Coming soon...</p>
  </div>
);

const Students = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Students Management</h1>
    <p>Coming soon...</p>
  </div>
);

const Canteen = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Canteen Management</h1>
    <p>Coming soon...</p>
  </div>
);

const Settings = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>Settings</h1>
    <p>Coming soon...</p>
  </div>
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
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: COLORS.white,
              color: COLORS.textPrimary,
              border: `1px solid ${COLORS.border}`,
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
