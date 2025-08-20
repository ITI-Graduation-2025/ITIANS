import { useState, useCallback } from "react";

export const useNetworkError = () => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error, operation) => {
    console.error(`Error in ${operation}:`, error);

    let errorMessage = "An unexpected error occurred.";
    let errorType = "unknown";

    // Handle Firebase specific errors
    if (error.code) {
      switch (error.code) {
        case "unavailable":
          errorMessage = "Service temporarily unavailable. Please try again.";
          errorType = "network";
          break;
        case "deadline-exceeded":
          errorMessage = "Request timed out. Please check your connection.";
          errorType = "timeout";
          break;
        case "permission-denied":
          errorMessage =
            "Permission denied. Please make sure you're logged in.";
          errorType = "permission";
          break;
        case "unauthenticated":
          errorMessage = "Please log in to continue.";
          errorType = "auth";
          break;
        case "resource-exhausted":
          errorMessage = "Service limit reached. Please try again later.";
          errorType = "limit";
          break;
        default:
          if (
            error.message?.includes("network") ||
            error.message?.includes("timeout")
          ) {
            errorMessage = "Network error. Please check your connection.";
            errorType = "network";
          }
      }
    } else if (error.message) {
      // Handle generic network errors
      if (
        error.message.includes("ERR_CONNECTION_TIMED_OUT") ||
        error.message.includes("ERR_NETWORK_CHANGED")
      ) {
        errorMessage =
          "Connection timeout. Please check your internet connection.";
        errorType = "timeout";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your connection.";
        errorType = "network";
      }
    }

    setError({
      message: errorMessage,
      type: errorType,
      originalError: error,
      operation,
    });

    return { message: errorMessage, type: errorType };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryOperation = useCallback(
    async (operation, maxRetries = 3) => {
      if (isRetrying) return;

      setIsRetrying(true);
      clearError();

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await operation();
          setIsRetrying(false);
          return result;
        } catch (error) {
          // Retry attempt failed
          if (attempt === maxRetries) {
            handleError(error, "retry");
            setIsRetrying(false);
            throw error;
          }

          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    },
    [isRetrying, clearError, handleError],
  );

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retryOperation,
  };
};
