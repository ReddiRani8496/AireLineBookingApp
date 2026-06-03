import { useBackendStatus } from "../contexts/BackendContext";

export const useNotification = () => {
  const { addNotification } = useBackendStatus();

  return {
    notifySuccess: (message, duration = 3000) =>
      addNotification(message, "success", duration),
    notifyError: (message, duration = 4000) =>
      addNotification(message, "error", duration),
    notifyInfo: (message, duration = 3000) =>
      addNotification(message, "info", duration),
  };
};
