import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login"); // Redirects user to login page after logout
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <h1 className="logo">Shadow</h1>
      </div>

      {isAuthenticated && (
        <ul className="nav-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/logs">Attack Logs</a></li>
          <li><a href="/settings">Settings</a></li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
