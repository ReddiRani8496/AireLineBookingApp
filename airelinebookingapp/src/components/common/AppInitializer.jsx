import React from "react";
import { useBackendStatus } from "../../contexts/BackendContext";
import BackendLoading from "./BackendLoading";
import Notification from "./Notification";
import "./AppInitializer.css";

const AppInitializer = ({ children }) => {
  const {
    isBackendReady,
    isChecking,
    error,
    notifications,
    removeNotification,
  } = useBackendStatus();

  // Show error message if backend check failed after max retries
  if (error && !isChecking) {
    return (
      <div className="backend-error-container">
        <div className="backend-error-content">
          <div className="error-icon">⚠️</div>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Refresh Page
          </button>
        </div>
        {/* Render notifications */}
        <div className="notifications-container">
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              duration={notif.duration}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show loading screen while checking backend health
  if (isChecking && !isBackendReady) {
    return (
      <>
        <BackendLoading />
        {/* Render notifications during loading */}
        <div className="notifications-container">
          {notifications.map((notif) => (
            <Notification
              key={notif.id}
              message={notif.message}
              type={notif.type}
              duration={notif.duration}
              onClose={() => removeNotification(notif.id)}
            />
          ))}
        </div>
      </>
    );
  }

  // Once backend is ready, render the app with notifications
  return (
    <>
      {children}
      {/* Render notifications overlay on app */}
      <div className="notifications-container">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            message={notif.message}
            type={notif.type}
            duration={notif.duration}
            onClose={() => removeNotification(notif.id)}
          />
        ))}
      </div>
    </>
  );
};

export default AppInitializer;
