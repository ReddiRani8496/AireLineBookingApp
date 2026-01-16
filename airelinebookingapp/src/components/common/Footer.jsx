import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-heading">Rani Airline</h3>
          <p className="footer-text">
            Your trusted partner for comfortable and safe travel.
          </p>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/flights" className="footer-link">
                Book Flights
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links">
            <li>
              <Link to="/terms" className="footer-link">
                Terms Of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>@ 2026 Rani Airelines. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
