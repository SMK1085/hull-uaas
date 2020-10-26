import { isArray, isNil, map } from "lodash";
import { PhoneNumberFormat } from "google-libphonenumber";
import {
  normalizeDomain,
  normalizeLinkedInUrl,
  normalizeFacebookUrl,
  normalizeTwitterUrl,
  normalizeCountryCodeCca2,
  normalizeCountryCodeCca3,
  normalizeCountryNameCommon,
  normalizeCountryNameOfficial,
  normalizePhone,
  normalizeWebsite,
} from "./normalization";
import { normalizeFloat, normalizeInteger } from "./normalization/numeric";

export class NormalizationHandler {
  readonly registeredMethods: {
    [key: string]: (attribValue: any, ...params: any[]) => any;
  };

  constructor() {
    // Register methods
    this.registeredMethods = {
      NONE: this.handleNone,
      COUNTRY_NAME_COMMON: this.handleCountryNameCommon,
      COUNTRY_NAME_OFFICIAL: this.handleCountryNameOfficial,
      COUNTRY_CODE_CCA2: this.handleCountryCodeCCA2,
      COUNTRY_CODE_CCA3: this.handleCountryCodeCCA3,
      LINKEDIN_URL: this.handleLinkedInUrl,
      FACEBOOK_URL: this.handleFacebookUrl,
      TWITTER_URL: this.handleTwitterUrl,
      DOMAIN: this.handleDomain,
      PHONE_INTERNATIONAL: this.handlePhoneInternational,
      PHONE_E164: this.handlePhoneE164,
      WEBSITE: this.handleWebsite,
      INT: this.handleInteger,
      FLOAT: this.handleFloat,
    };
  }

  public handleNormalization(
    attribValue: any,
    method: string,
    ...params: any[]
  ): any {
    if (!Object.keys(this.registeredMethods).includes(method)) {
      throw new Error(
        `Normalization method '${method}' is not registered. Allowed methods are ${Object.keys(
          this.registeredMethods,
        ).join(", ")}.`,
      );
    }

    return this.registeredMethods[method](attribValue, ...params);
  }

  private handleNone(attribValue: any): any {
    return attribValue;
  }

  private handleCountryNameCommon(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeCountryNameCommon(a));
    }

    return normalizeCountryNameCommon(attribValue);
  }

  private handleCountryNameOfficial(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeCountryNameOfficial(a));
    }

    return normalizeCountryNameOfficial(attribValue);
  }

  private handleCountryCodeCCA2(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeCountryCodeCca2(a));
    }

    return normalizeCountryCodeCca2(attribValue);
  }

  private handleCountryCodeCCA3(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeCountryCodeCca3(a));
    }

    return normalizeCountryCodeCca3(attribValue);
  }

  private handleLinkedInUrl(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeLinkedInUrl(a));
    }

    return normalizeLinkedInUrl(attribValue);
  }

  private handleFacebookUrl(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeFacebookUrl(a));
    }

    return normalizeFacebookUrl(attribValue);
  }

  private handleTwitterUrl(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeTwitterUrl(a));
    }

    return normalizeTwitterUrl(attribValue);
  }

  private handleDomain(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeDomain(a));
    }

    return normalizeDomain(attribValue);
  }

  private handlePhoneInternational(attribValue: any, ...params: any[]): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    let countryCode = params[0];

    if (isArray(attribValue)) {
      return map(attribValue, (a) =>
        normalizePhone(a, countryCode, PhoneNumberFormat.INTERNATIONAL),
      );
    }

    return normalizePhone(
      attribValue,
      countryCode,
      PhoneNumberFormat.INTERNATIONAL,
    );
  }

  private handlePhoneE164(attribValue: any, ...params: any[]): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    const countryCode = params[0];

    if (isArray(attribValue)) {
      return map(attribValue, (a) =>
        normalizePhone(a, countryCode, PhoneNumberFormat.E164),
      );
    }

    return normalizePhone(attribValue, countryCode, PhoneNumberFormat.E164);
  }

  private handleWebsite(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeWebsite(a));
    }

    return normalizeWebsite(attribValue);
  }

  private handleInteger(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeInteger(a));
    }

    return normalizeInteger(attribValue);
  }

  private handleFloat(attribValue: any): any {
    if (isNil(attribValue)) {
      return undefined;
    }

    if (isArray(attribValue)) {
      return map(attribValue, (a) => normalizeFloat(a));
    }

    return normalizeFloat(attribValue);
  }
}
