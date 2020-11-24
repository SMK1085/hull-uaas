import { isNil, isString, startCase, lowerCase, upperCase } from "lodash";
export const normalizeToLowercase = (raw: any): string | undefined => {
  let result = undefined;
  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  return lowerCase(raw);
};

export const normalizeToUppercase = (raw: any): string | undefined => {
  let result = undefined;
  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  return upperCase(raw);
};

export const normalizeToStartcase = (raw: any): string | undefined => {
  let result = undefined;
  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  return startCase(lowerCase(raw));
};
