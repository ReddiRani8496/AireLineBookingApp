import React, { useEffect, useState } from "react";

// show the message
function MessageDisplay({ message, type = "error", onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = type == "error";
  const displayClass = isError ? "error-display" : "success-display";
  const messageClass = isError ? "error-message" : "success-message";
  const progressClass = isError ? "error-progress" : "success-progress";

  return <div>MessageDisplay</div>;
}

// hooks, custom hook

export const useMessage = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const showError = (message) => {
    setErrorMessage(message);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  const dismissError = () => {
    setErrorMessage(null);
  };

  const dismissSuccess = () => {
    setSuccessMessage(null);
  };

  return {
    // component to render error message
    ErrorDisplay: () => {
      <MessageDisplay
        message={errorMessage}
        type="error"
        onDismiss={dismissError}
      />;
    },

    // component to render successmessage
    successDisplay: () => {
      <MessageDisplay
        message={successMessage}
        type="success"
        onDismiss={dismissSuccess}
      />;
    },
    showError,
    showSuccess,
    dismissError,
    dismissSuccess,
  };
};

export default MessageDisplay;
