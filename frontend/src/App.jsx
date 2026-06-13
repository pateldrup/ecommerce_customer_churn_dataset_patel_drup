import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Predictions from './pages/Predictions';
import Segments from './pages/Segments';
import Settings from './pages/Settings';
import Login from './pages/Login';
import authService from './services/authService';
import ToastContainer from './components/ui/Toast';

// Component to protect authenticated routes
const ProtectedRoute = ({ children }) => {
  const isAuth = authService.isAuthenticated();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// Main Layout wrapping sidebar, top navbar, and core page elements
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Console Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication page */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard sub-panels (All Protected) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Customers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/predictions"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Predictions />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/segments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Segments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
