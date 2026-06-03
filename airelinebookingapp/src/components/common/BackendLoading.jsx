import React from "react";
import "./BackendLoading.css";

const BackendLoading = () => {
  return (
    <div className="backend-loading-container">
      <div className="backend-loading-content">
        <div className="loading-spinner"></div>
        <h2>Initializing Application</h2>
        <p>Connecting to server...</p>
        <p className="loading-subtitle">
          Please wait while we establish a connection with the backend server.
        </p>
        <div className="dots-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default BackendLoading;
