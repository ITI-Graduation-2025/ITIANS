/**
 * Given an array of objects, returns a new array containing unique values of the
 * specified key. Does not mutate the original array.
 *
 * @param {Array<Object>} array - The array of objects to get unique values from.
 * @param {string} key - The key to get unique values for.
 * @returns {Array} - An array of unique values.
 */
//
export const getUniqueValues = (array, key) => {
  return Array.from(new Set(array.map((item) => item[key])));
};

// get all values  from object inside array

export const getAllSpecificValueInsideArray = (array, key) => {
  return array.map((item) => item[key]);
};

// get array from value in object

export const getArrayFromValue = (array, key, value) => {
  return array.filter((item) => item[key] === value);
};
