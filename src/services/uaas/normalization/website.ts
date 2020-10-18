import { isNil, isString } from "lodash";
import normalizeUrl from "normalize-url";

export const normalizeWebsite = (raw: any): string | undefined => {
  let result = undefined;

  if (isNil(raw) || !isString(raw)) {
    return result;
  }

  try {
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
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }

  return result;
};
