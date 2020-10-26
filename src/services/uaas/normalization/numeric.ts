import { isBoolean, isNil, isNumber, isString } from "lodash";

export const normalizeInteger = (raw: any): number | undefined => {
  let result = undefined;

  if (isNil(raw)) {
    return result;
  }

  if (isNumber(raw)) {
    result = Math.round(raw);
    return result;
  }

  if (isString(raw)) {
    try {
      // Cast the string to an integer
      result = parseInt(raw, 10);
      if (isNaN(result)) {
        result = undefined;
        // Attempt to parse as float and convert to integer
        const floatNum = parseFloat(raw);
        if (!isNaN(floatNum)) {
          result = Math.round(floatNum);
        } else {
          result = undefined;
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  }

  return result;
};

export const normalizeFloat = (raw: any): number | undefined => {
  let result = undefined;

  if (isNil(raw)) {
    return result;
  }

  if (isBoolean(raw)) {
    return result;
  }

  if (isFinite(raw)) {
    result = raw;
  }

  if (isString(raw)) {
    try {
      // Cast to float
      const floatNum = parseFloat(raw);
      if (isFinite(floatNum)) {
        result = floatNum;
      } else {
        result = undefined;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
    }
  }

  return result;
};
