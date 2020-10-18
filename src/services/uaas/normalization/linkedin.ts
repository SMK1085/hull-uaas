import { isNil, isString } from "lodash";
import normalizeUrl from "normalize-url";
import { URL } from "url";

export const normalizeLinkedInUrl = (raw: any): string | undefined => {
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
        removeQueryParameters: [/^utm_\w+/i, "ref"],
      });
    }

    if (isNil(result)) {
      return undefined;
    }

    const linkedInUrl = new URL(result);
    if (linkedInUrl.hostname !== "linkedin.com") {
      throw new Error(
        `Hostname '${linkedInUrl.hostname}' is not the expected hostname 'linkedin.com'.`,
      );
    }

    if (
      result &&
      result.includes("linkedin.com") &&
      !result.includes("www.linkedin.com")
    ) {
      result = result.replace("linkedin.com", "www.linkedin.com");
    }

    return result;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
    result = undefined;
  }

  return result;
};
