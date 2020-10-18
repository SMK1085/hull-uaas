import { isNil, isString } from "lodash";
import normalizeUrl from "normalize-url";

export const normalizeTwitterUrl = (raw: any): string | undefined => {
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
      throw new Error(`Failed to normalize url '${raw}'.`);
    }

    const twitterUrl = new URL(result);
    if (twitterUrl.hostname !== "twitter.com") {
      throw new Error(
        `Hostname '${twitterUrl.hostname}' is not the expected hostname 'twitter.com'.`,
      );
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
