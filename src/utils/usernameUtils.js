// Arabic to English character mapping for username generation
const arabicToEnglish = {
  ا: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
  ة: "a",
  ى: "a",
  ئ: "y",
  ء: "a",
  // Numbers
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

/**
 * Convert Arabic text to English for username generation
 * @param {string} text - Arabic text to convert
 * @returns {string} - English equivalent
 */
export const arabicToEnglishText = (text) => {
  if (!text) return "";

  return text
    .split("")
    .map((char) => arabicToEnglish[char] || char)
    .join("")
    .toLowerCase();
};

/**
 * Generate username suggestions based on name
 * @param {string} name - Full name
 * @returns {string[]} - Array of username suggestions
 */
export const generateUsernameSuggestions = (name) => {
  if (!name) return [];

  // Convert Arabic to English if needed
  const englishName = arabicToEnglishText(name);

  // Clean and normalize the name
  const cleanName = englishName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".");

  if (!cleanName) return [];

  const suggestions = [
    cleanName,
    cleanName.replace(/\./g, "_"),
    cleanName.replace(/\./g, ""),
    cleanName.split(".")[0] || cleanName,
    cleanName.split(".")[0] + "." + (cleanName.split(".")[1] || ""),
  ].filter(Boolean);

  // Add numbered variations
  const numberedSuggestions = [];
  suggestions.forEach((suggestion) => {
    if (suggestion.length >= 3) {
      numberedSuggestions.push(
        suggestion + Math.floor(10 + Math.random() * 90),
        suggestion + "_" + Math.floor(100 + Math.random() * 900),
        suggestion + Math.floor(1000 + Math.random() * 9000),
      );
    }
  });

  return [...new Set([...suggestions, ...numberedSuggestions])].slice(0, 10);
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {object} - Validation result
 */
export const validateUsername = (username) => {
  if (!username) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be 20 characters or less" };
  }

  if (!/^[a-z0-9._]+$/.test(username)) {
    return {
      valid: false,
      error:
        "Username can only contain lowercase letters, numbers, dots, and underscores",
    };
  }

  if (
    username.startsWith(".") ||
    username.endsWith(".") ||
    username.startsWith("_") ||
    username.endsWith("_")
  ) {
    return {
      valid: false,
      error: "Username cannot start or end with dot or underscore",
    };
  }

  if (
    username.includes("..") ||
    username.includes("__") ||
    username.includes("._") ||
    username.includes("_.")
  ) {
    return {
      valid: false,
      error: "Username cannot contain consecutive dots or underscores",
    };
  }

  return { valid: true };
};

/**
 * Normalize username for storage
 * @param {string} username - Username to normalize
 * @returns {string} - Normalized username
 */
export const normalizeUsername = (username) => {
  if (!username) return "";

  return username
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._]/g, "")
    .slice(0, 20);
};
