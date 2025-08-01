import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DevicesPage from './pages/DevicesPage';
import ConfigsPage from './pages/ConfigsPage';
import DeviceFormPage from './pages/DeviceFormPage';
import ConfigFormPage from './pages/ConfigFormPage';
import { getToken } from './utils/auth';

// PUBLIC_INTERFACE
function App() {
  // theme can be toggled by user; default is light as per requirements
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar at top, always visible */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <div className="main-layout">
          {/* Sidebar always present except login/register page */}
          <SidebarLayout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices"
                element={
                  <RequireAuth>
                    <DevicesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices/new"
                element={
                  <RequireAuth>
                    <DeviceFormPage mode="create" />
                  </RequireAuth>
                }
              />
              <Route
                path="/devices/:id/edit"
                element={
                  <RequireAuth>
                    <DeviceFormPage mode="edit" />
                  </RequireAuth>
                }
              />
              <Route
                path="/configs"
                element={
                  <RequireAuth>
                    <ConfigsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/configs/new"
                element={
                  <RequireAuth>
                    <ConfigFormPage mode="create" />
                  </RequireAuth>
                }
              />
              <Route
                path="/configs/:id/edit"
                element={
                  <RequireAuth>
                    <ConfigFormPage mode="edit" />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </SidebarLayout>
        </div>
      </div>
    </Router>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  // If not authenticated, redirect to /login
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;

  return children;
}

// PUBLIC_INTERFACE
function SidebarLayout({ children }) {
  // Don't show sidebar on /login or /register
  const location = useLocation();
  const hideSidebar = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="app-content-row">
      {!hideSidebar && <Sidebar />}
      <main className={`content-area${hideSidebar ? ' no-sidebar' : ''}`}>
        {children}
      </main>
    </div>
  );
}

export default App;
