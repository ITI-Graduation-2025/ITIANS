import { formatDistanceToNow } from "date-fns";

/**
 * Safely formats a timestamp to a relative time string
 * @param {any} timestamp - The timestamp to format (can be Date, Firestore timestamp, or string)
 * @param {Object} options - Options for formatDistanceToNow
 * @returns {string} - Formatted relative time string or fallback text
 */
export const safeFormatDistanceToNow = (
  timestamp,
  options = { addSuffix: true },
) => {
  if (!timestamp) {
    return "Just now";
  }

  try {
    let date;

    // Handle Firestore timestamp
    if (timestamp && typeof timestamp === "object" && timestamp.toDate) {
      date = timestamp.toDate();
    }
    // Handle regular Date object
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Handle string or number
    else {
      date = new Date(timestamp);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp:", timestamp);
      return "Just now";
    }

    return formatDistanceToNow(date, options);
  } catch (error) {
    console.warn("Error formatting timestamp:", error, "Timestamp:", timestamp);
    return "Just now";
  }
};

/**
 * Safely converts a timestamp to a Date object
 * @param {any} timestamp - The timestamp to convert
 * @returns {Date|null} - Date object or null if invalid
 */
export const safeTimestampToDate = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  try {
    // Handle Firestore timestamp
    if (timestamp && typeof timestamp === "object" && timestamp.toDate) {
      return timestamp.toDate();
    }
    // Handle regular Date object
    else if (timestamp instanceof Date) {
      return timestamp;
    }
    // Handle string or number
    else {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (error) {
    console.warn(
      "Error converting timestamp to date:",
      error,
      "Timestamp:",
      timestamp,
    );
    return null;
  }
};
