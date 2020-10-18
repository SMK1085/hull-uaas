import { isNil, isString } from "lodash";
import countryData from "../../../../assets/data/countries.json";

const getCountryInfoForRawInput = (raw: string): any => {
  let result = undefined;

  if (raw.length === 2) {
    // assume we have a cca2 country code
    const cca2Raw = raw.toUpperCase();
    const countryInfo = countryData.find((cd) => {
      return cd.cca2 === cca2Raw;
    });

    if (countryInfo) {
      result = countryInfo;
    }
  } else if (raw.length === 3) {
    const cca3Raw = raw.toUpperCase();
    const countryInfo = countryData.find((cd) => {
      return cd.cca3 === cca3Raw;
    });

    if (countryInfo) {
      result = countryInfo;
    }
  } else if (raw.length > 3) {
    // assume we have a name to deal with
    const nameRawLower = raw.toLowerCase();
    const countryInfo = countryData.find((cd) => {
      const nativeNamesLower: string[] = [];

      for (const k in cd.name.native) {
        const v = (cd.name.native as any)[k];
        if (v !== undefined) {
          if (v.common !== undefined && typeof v.common === "string") {
            nativeNamesLower.push(v.common.toLowerCase());
          }

          if (v.official !== undefined && typeof v.official === "string") {
            nativeNamesLower.push(v.official.toLowerCase());
          }
        }
      }

      return (
        cd.name.common.toLowerCase() === nameRawLower ||
        cd.name.official.toLowerCase() === nameRawLower ||
        nativeNamesLower.includes(nameRawLower)
      );
    });

    if (countryInfo) {
      result = countryInfo;
    }
  }

  return result;
};

/**
 * Returns a valid ISO 3166-1 alpha-2 country code if the
 * raw input is either a valid cca2, cca3, common or official name in English or the native languages.
 * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
 */
export const normalizeCountryCodeCca2 = (raw: any): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  const countryInfo = getCountryInfoForRawInput(raw);

  if (!isNil(countryInfo)) {
    result = countryInfo.cca2;
  }

  return result;
};

/**
 * Returns a valid ISO 3166-1 alpha-3 country code if the
 * raw input is either a valid cca2, cca3, common or official name in English or the native languages.
 * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
 */
export const normalizeCountryCodeCca3 = (raw: any): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  const countryInfo = getCountryInfoForRawInput(raw);

  if (!isNil(countryInfo)) {
    result = countryInfo.cca3;
  }

  return result;
};

/**
 * Returns a valid common country name in English if the
 * raw input is either a valid cca2, cca3, common or official name in English or the native languages.
 * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
 */
export const normalizeCountryNameCommon = (raw: any): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  const countryInfo = getCountryInfoForRawInput(raw);

  if (!isNil(countryInfo)) {
    result = countryInfo.name.common;
  }

  return result;
};

/**
 * Returns a valid official country name in English if the
 * raw input is either a valid cca2, cca3, common or official name in English or the native languages.
 * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
 */
export const normalizeCountryNameOfficial = (raw: any): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  const countryInfo = getCountryInfoForRawInput(raw);

  if (!isNil(countryInfo)) {
    result = countryInfo.name.official;
  }

  return result;
};

/**
 * Returns the country info given a TLD.
 * @param raw The top level domain, starting with a dot, e.g. `.de`, `.at`, `.fr`.
 * @param infoType The desired info type about the country.
 */
export const getCountryInfoByTopLevelDomain = (
  raw: any,
  infoType: "CCA2" | "CCA3" | "NAME_COMMON" | "NAME_OFFICIAL",
): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  if (!raw.startsWith(".")) {
    return result;
  }
  const tldRaw = raw.toLowerCase();
  const countryInfo = countryData.find((cd) => {
    return (cd.tld as string[]).includes(tldRaw);
  });

  if (!isNil(countryInfo)) {
    switch (infoType) {
      case "CCA3":
        result = countryInfo.cca3;
        break;
      case "NAME_COMMON":
        result = countryInfo.name.common;
        break;
      case "NAME_OFFICIAL":
        result = countryInfo.name.official;
        break;
      default:
        result = countryInfo.cca2;
        break;
    }
  }

  return result;
};
