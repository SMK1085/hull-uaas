import normalizeUrl from "normalize-url";
import { URL } from "url";
import countryData from "../../../assets/data/countries.json";

export class UaasHelpers {
  public static sanitizeUrlStringValue(raw: string): string {
    let result = raw;
    const REGEX_WEBSITE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (REGEX_WEBSITE.test(raw)) {
      result = normalizeUrl(raw, {
        defaultProtocol: "https:",
        forceHttps: true,
        normalizeProtocol: true,
        removeTrailingSlash: true,
        sortQueryParameters: true,
        stripAuthentication: true,
        stripHash: true,
        stripWWW: true,
      });

      // Strip out any paths or query strings
      const urlObject = new URL(result);
      result = `${urlObject.protocol}//${urlObject.hostname}`;
    }

    return result;
  }

  public static sanitizeLinkedInUrl(raw: string): string {
    let result = raw;
    const REGEX_WEBSITE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (REGEX_WEBSITE.test(raw)) {
      result = normalizeUrl(raw, {
        defaultProtocol: "https:",
        forceHttps: true,
        normalizeProtocol: true,
        removeTrailingSlash: true,
        sortQueryParameters: true,
        stripAuthentication: true,
        stripHash: true,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i, "ref"],
      });
    }
    if (
      result.includes("linkedin.com") &&
      !result.includes("www.linkedin.com")
    ) {
      result = result.replace("linkedin.com", "www.linkedin.com");
    }

    return result;
  }

  public static sanitizeFacebookUrl(raw: string): string {
    let result = raw;
    const REGEX_WEBSITE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (REGEX_WEBSITE.test(raw)) {
      result = normalizeUrl(raw, {
        defaultProtocol: "https:",
        forceHttps: true,
        normalizeProtocol: true,
        removeTrailingSlash: true,
        sortQueryParameters: true,
        stripAuthentication: true,
        stripHash: true,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i, "ref"],
      });
    }
    if (
      result.includes("facebook.com") &&
      !result.includes("www.facebook.com")
    ) {
      result = result.replace("facebook.com", "www.facebook.com");
    }

    return result;
  }

  public static sanitizeTwitterUrl(raw: string): string {
    let result = raw;
    const REGEX_WEBSITE = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if (REGEX_WEBSITE.test(raw)) {
      result = normalizeUrl(raw, {
        defaultProtocol: "https:",
        forceHttps: true,
        normalizeProtocol: true,
        removeTrailingSlash: true,
        sortQueryParameters: true,
        stripAuthentication: true,
        stripHash: true,
        stripWWW: true,
        removeQueryParameters: [/^utm_\w+/i, "ref"],
      });
    }

    return result;
  }

  /**
   * Returns a valid ISO 3166-1 alpha-2 country code if the raw input is either a valid cca2, cca3, common or official name in English or the native languages.
   * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
   */
  public static sanitizeCountryCodeCca2(raw: string): string | undefined {
    let result: string | undefined;
    if (raw.length === 2) {
      // assume we have a cca2 country code
      const cca2Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca2 === cca2Raw;
      });

      if (countryInfo) {
        result = countryInfo.cca2;
      }
    } else if (raw.length === 3) {
      const cca3Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca3 === cca3Raw;
      });

      if (countryInfo) {
        result = countryInfo.cca2;
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
        result = countryInfo.cca2;
      }
    }

    return result;
  }

  /**
   * Returns a valid ISO 3166-1 alpha-3 country code if the raw input is either a valid cca2, cca3, common or official name in English or the native languages.
   * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
   */
  public static sanitizeCountryCodeCca3(raw: string): string | undefined {
    let result: string | undefined;
    if (raw.length === 2) {
      // assume we have a cca2 country code
      const cca2Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca2 === cca2Raw;
      });

      if (countryInfo) {
        result = countryInfo.cca3;
      }
    } else if (raw.length === 3) {
      const cca3Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca3 === cca3Raw;
      });

      if (countryInfo) {
        result = countryInfo.cca3;
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
        result = countryInfo.cca3;
      }
    }

    return result;
  }

  /**
   * Returns a valid common name in english if the raw input is either a valid cca2, cca3, common or official name in English or the native languages.
   * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
   */
  public static sanitizeCountryNameCommon(raw: string): string | undefined {
    let result: string | undefined;
    if (raw.length === 2) {
      // assume we have a cca2 country code
      const cca2Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca2 === cca2Raw;
      });

      if (countryInfo) {
        result = countryInfo.name.common;
      }
    } else if (raw.length === 3) {
      const cca3Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca3 === cca3Raw;
      });

      if (countryInfo) {
        result = countryInfo.name.common;
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
        result = countryInfo.name.common;
      }
    }

    return result;
  }

  /**
   * Returns a valid official name in english if the raw input is either a valid cca2, cca3, common or official name in English or the native languages.
   * @param raw Raw string, can be either an unformatted country code such as de, deu, DE, DEU or a country name such as Germany, germany.
   */
  public static sanitizeCountryNameOfficial(raw: string): string | undefined {
    let result: string | undefined;
    if (raw.length === 2) {
      // assume we have a cca2 country code
      const cca2Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca2 === cca2Raw;
      });

      if (countryInfo) {
        result = countryInfo.name.official;
      }
    } else if (raw.length === 3) {
      const cca3Raw = raw.toUpperCase();
      const countryInfo = countryData.find((cd) => {
        return cd.cca3 === cca3Raw;
      });

      if (countryInfo) {
        result = countryInfo.name.official;
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
        result = countryInfo.name.official;
      }
    }

    return result;
  }

  /**
   * Returns the country info given a TLD.
   * @param tld The top level domain, starting with a dot, e.g. `.de`, `.at`, `.fr`.
   * @param infoType The desired info type about the country.
   */
  public static getCountryInfoForTld(
    tld: string,
    infoType: "CCA2" | "CCA3" | "NAME_COMMON" | "NAME_OFFICIAL",
  ): string | undefined {
    let result: string | undefined;
    if (!tld.startsWith(".")) {
      return result;
    }

    const tldRaw = tld.toLowerCase();
    const countryInfo = countryData.find((cd) => {
      return (cd.tld as string[]).includes(tldRaw);
    });

    if (countryInfo) {
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
  }
}
