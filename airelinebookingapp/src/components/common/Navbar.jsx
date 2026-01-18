import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApiService from "../../services/ApiService";
import "./Navbar.css";

function Navbar() {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isPilot = ApiService.isPilot();
  const isCustomer = ApiService.isCustomer();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-airline">Rani</span>
            <span className="logo-text">Airlines</span>
          </Link>
        </div>
        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? "X" : "☰"}
        </button>
        <div className={`navbar-links ${isMenuOpen ? "active" : "hidden"}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/flights" className="nav-link">
            Find Flights
          </Link>

          {isAuthenticated ? (
            <>
              {isCustomer && (
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              )}
              {isPilot && (
                <Link to="/pilot" className="nav-link">
                  Pilot
                </Link>
              )}
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button className="nav-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
