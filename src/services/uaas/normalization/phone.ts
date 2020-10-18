import { isNil, isString } from "lodash";
import {
  PhoneNumberUtil,
  PhoneNumber,
  PhoneNumberFormat,
} from "google-libphonenumber";
import { normalizeCountryCodeCca2 } from "./country";

export const normalizePhone = (
  raw: any,
  rawCountry: any,
  format: PhoneNumberFormat,
): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  try {
    const phoneUtil = new PhoneNumberUtil();
    const countryCode = isNil(rawCountry)
      ? undefined
      : normalizeCountryCodeCca2(rawCountry);
    let number: PhoneNumber | undefined;
    number = phoneUtil.parseAndKeepRawInput(raw, countryCode);

    if (!isNil(number) && phoneUtil.isValidNumber(number)) {
      result = phoneUtil.format(number, format);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }

  return result;
};
