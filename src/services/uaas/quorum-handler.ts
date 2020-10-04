import { uuasV1 } from "../../definitions/uaas/v1";
import {
  Schema$HullAttributesUser,
  Schema$HullAttributesAccount,
} from "../../definitions/hull/hull-objects";
import {
  forEach,
  groupBy,
  forIn,
  filter,
  first,
  sortBy,
  set,
  get,
  isNil,
} from "lodash";
import { UaasHelpers } from "./uaas-helpers";

export class QuorumHandler {
  // readonly appSettings: uuas_v1.Schema$AppSettings;

  constructor() {
    // this.appSettings = options.hullAppSettings as uuas_v1.Schema$AppSettings;
  }

  public handleUser(
    user: Schema$HullAttributesUser,
  ): Schema$HullAttributesUser {
    const changedAttribs: Schema$HullAttributesUser = {};
    // TODO: Handle priority

    // TODO: Handle last changed

    // TODO: Handle quorum

    return changedAttribs;
  }

  public handleAccount(
    account: Schema$HullAttributesAccount,
    mapping: uuasV1.Schema$UnificationMapping,
    normalizations: uuasV1.Schema$NormalizationDefinition[],
  ): Schema$HullAttributesAccount {
    // TODO: Handle priority and last changed strategies

    // TODO: Replace with real logging
    // console.log(account, mapping);
    const changedAttribs: Schema$HullAttributesAccount = {};
    const quorumMembers: any[] = [];

    forEach(mapping.sources, (sourceAttrib: string) => {
      let attribVal = get(account, sourceAttrib, undefined);
      if (!isNil(attribVal)) {
        const normalizationsToApply = filter(
          normalizations,
          (n: uuasV1.Schema$NormalizationDefinition) => {
            return n.sources.includes(sourceAttrib);
          },
        );

        forEach(
          normalizationsToApply,
          (n: uuasV1.Schema$NormalizationDefinition) => {
            if (n.method === "COUNTRY_NAME_OFFICIAL") {
              attribVal = UaasHelpers.sanitizeCountryNameOfficial(
                attribVal as string,
              );
            } else if (n.method === "COUNTRY_NAME_COMMON") {
              attribVal = UaasHelpers.sanitizeCountryNameCommon(
                attribVal as string,
              );
            } else if (n.method === "COUNTRY_CODE_CCA2") {
              attribVal = UaasHelpers.sanitizeCountryCodeCca2(
                attribVal as string,
              );
            } else if (n.method === "COUNTRY_CODE_CCA3") {
              attribVal = UaasHelpers.sanitizeCountryCodeCca3(
                attribVal as string,
              );
            } else if (n.method === "LINKEDIN_URL") {
              attribVal = UaasHelpers.sanitizeLinkedInUrl(attribVal as string);
            } else if (n.method === "FACEBOOK_URL") {
              attribVal = UaasHelpers.sanitizeFacebookUrl(attribVal as string);
            } else if (n.method === "TWITTER_URL") {
              attribVal = UaasHelpers.sanitizeTwitterUrl(attribVal as string);
            }
          },
        );

        quorumMembers.push(attribVal);
      }
    });

    if (quorumMembers.length === 0) {
      return changedAttribs;
    }

    const groupedMembers = groupBy(quorumMembers, (m) => m);
    const weightedMembers: { key: any; count: number }[] = [];
    forIn(groupedMembers, (l, g) => {
      weightedMembers.push({ key: g, count: l.length });
    });
    const quorumMajority = quorumMembers.length / 2;
    const membersSimpleMajority = filter(
      weightedMembers,
      (m) => m.count > quorumMajority,
    );
    const quorumDecision =
      membersSimpleMajority.length === 0
        ? null
        : first(sortBy(membersSimpleMajority, ["count"]));
    let quorumConfidence = 0;
    if (quorumDecision && quorumMembers.length > 0) {
      quorumConfidence = quorumDecision.count / quorumMembers.length;
      set(changedAttribs, mapping.name, quorumDecision.key);
    } else {
      set(changedAttribs, mapping.name, null);
    }

    set(
      changedAttribs,
      `${mapping.name}_confidence`,
      Math.round(quorumConfidence * 100),
    );

    return changedAttribs;
  }
}
