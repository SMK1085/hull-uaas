import { get, isNil, set } from "lodash";
import { Schema$HullAttributesUser } from "../../../definitions/hull/hull-objects";
import { uaasV1 } from "../../../definitions/uaas/v1";
import freemail from "freemail";

export class EmailHandler implements uaasV1.Resource$UserHandler {
  readonly appSettings: uaasV1.Schema$AppSettings;

  constructor(options: any) {
    this.appSettings = options.hullAppSettings;
  }

  public handleUser(
    user: Schema$HullAttributesUser,
  ): Schema$HullAttributesUser {
    const changedAttribs: Schema$HullAttributesUser = {};

    if (this.appSettings.user_freemail_enabled !== true) {
      return changedAttribs;
    }

    if (isNil(this.appSettings.user_freemail_attribute)) {
      return changedAttribs;
    }

    try {
      const emailAttribute = get(
        user,
        this.appSettings.user_freemail_attribute,
        null,
      ) as string | undefined | null;

      if (isNil(emailAttribute) || emailAttribute.trim() === "") {
        set(changedAttribs, "unified/emailcheck_email", null);
        set(changedAttribs, "unified/emailcheck_isfreemail", null);
        set(changedAttribs, "unified/emailcheck_isdisposable", null);
        set(changedAttribs, "unified/emailcheck_isblacklist", null);
      } else {
        set(changedAttribs, "unified/emailcheck_email", emailAttribute);
        set(
          changedAttribs,
          "unified/emailcheck_isfreemail",
          freemail.isFree(emailAttribute),
        );
        set(
          changedAttribs,
          "unified/emailcheck_isdisposable",
          freemail.isDisposable(emailAttribute),
        );
        set(
          changedAttribs,
          "unified/emailcheck_isblacklist",
          this.isBlacklisted(emailAttribute),
        );
      }

      return changedAttribs;
    } catch (error) {
      // TODO: Add logging
      return {};
    }
  }

  private isBlacklisted(email: string): boolean {
    if (isNil(this.appSettings.user_freemail_blacklist)) {
      return false;
    }
    const uniformBlacklistedDomains = this.appSettings.user_freemail_blacklist.map(
      (domain) => {
        return domain.toLowerCase().trim();
      },
    );
    const emailSplits = email.split("@");
    if (emailSplits.length !== 2) {
      return false;
    }

    const emailDomain = emailSplits[1].toLowerCase().trim();
    return uniformBlacklistedDomains.includes(emailDomain);
  }
}
