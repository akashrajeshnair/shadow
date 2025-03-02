import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import AttackLogs from "./pages/attacklogs";
import Home from "./pages/home";
import Settings from "./pages/settings";
import Login from "./pages/login";
import Signup from "./pages/signup";
import FileService from "./pages/DeviceDetails/FileService";
import MQTT from "./pages/DeviceDetails/MQTT";
import Telnet from "./pages/DeviceDetails/Telnet";
import Router from "./pages/DeviceDetails/Router";
import SSH from "./pages/DeviceDetails/SSH";

const App = () => {
  // Load authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Listen for token changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", checkAuth); // Sync across tabs
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <>
      {isAuthenticated && (
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      )}

      <div className="d-flex">
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup />} />

            {/* Private Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/logs" element={<AttackLogs />} />
                <Route path="/settings" element={<Settings />} />

                {/* Device Details - Grouped under /devices/ */}
                <Route path="/DeviceDetails/FileService" element={<FileService />} />
                <Route path="/DeviceDetails/MQTT" element={<MQTT />} />
                <Route path="/DeviceDetails/Telnet" element={<Telnet />} />
                <Route path="/DeviceDetails/Router" element={<Router />} />
                <Route path="/DeviceDetails/SSH" element={<SSH />} />

                {/* Default Redirect for Authenticated Users */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              // Redirect unauthenticated users to login
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
