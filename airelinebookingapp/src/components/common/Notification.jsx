import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to finish
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`notification notification-${type} ${
        isVisible ? "show" : "hide"
      }`}
    >
      <div className="notification-content">
        <span className="notification-icon">
          {type === "success" && "✓"}
          {type === "error" && "✕"}
          {type === "info" && "ℹ"}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <div className="notification-progress-bar"></div>
    </div>
  );
};

export default Notification;
