import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import ApiService from "../services/ApiService";

const BackendContext = createContext();

export const BackendProvider = ({ children }) => {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const retryCountRef = useRef(0);
  const maxRetries = 30; // Maximum 30 retries (1 minute with 2 second intervals)
  const notificationIdRef = useRef(0);

  const addNotification = (message, type = "info", duration = 4000) => {
    const id = notificationIdRef.current++;
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    let retryTimer;
    let isMounted = true;

    const checkBackendHealth = async () => {
      if (!isMounted) return;

      try {
        // Try to call a simple endpoint to check if backend is up
        await ApiService.checkBackendHealth();

        if (isMounted) {
          setIsBackendReady(true);
          setIsChecking(false);
          setError(null);
          retryCountRef.current = 0; // Reset retry count on success
          addNotification("Backend server is ready!", "success", 3000);
        }
      } catch (err) {
        if (!isMounted) return;

        retryCountRef.current += 1;

        if (retryCountRef.current >= maxRetries) {
          // Stop retrying after max attempts
          const errorMsg =
            "Backend server is taking too long. Please check your connection and refresh the page.";
          setError(errorMsg);
          setIsChecking(false);
          addNotification(errorMsg, "error", 6000);
        } else {
          // Still checking, keep the loading state
          setError(null);
          // Retry every 2 seconds if backend is not ready
          retryTimer = setTimeout(checkBackendHealth, 2000);
        }
      }
    };

    checkBackendHealth();

    // Cleanup function
    return () => {
      isMounted = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, []);

  return (
    <BackendContext.Provider
      value={{
        isBackendReady,
        isChecking,
        error,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </BackendContext.Provider>
  );
};

export const useBackendStatus = () => {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error("useBackendStatus must be used within BackendProvider");
  }
  return context;
};
