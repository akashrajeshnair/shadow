import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/navbar";
import Dashboard from "./pages/dashboard";
import AttackLogs from "./pages/attacklogs";
import Home from "./pages/home";
import Settings from "./pages/settings";

const App = () => {
  return (
    <>
      <CustomNavbar />
      <div className="d-flex">
        
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logs" element={<AttackLogs />} />
            <Route path="/settings" element={Settings} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
