import {
  forEach,
  isArray,
  compact,
  forIn,
  filter,
  first,
  sortBy,
  groupBy,
  set,
  isNil,
  get,
} from "lodash";
import { uaasV1 } from "../../../definitions/uaas/v1";
import {
  Schema$HullAttributesUser,
  Schema$HullAttributesAccount,
  Schema$HullAttributesCommon,
} from "../../../definitions/hull/hull-objects";
import { NormalizationHandler } from "../normalization-handler";

export class QuorumStrategyHandler implements uaasV1.Resource$StrategyHandler {
  readonly appSettings: uaasV1.Schema$AppSettings;
  readonly normalizationHandler: NormalizationHandler;

  constructor(options: any) {
    this.appSettings = options.hullAppSettings;
    this.normalizationHandler = new NormalizationHandler();
  }

  public handleUser(
    user: Schema$HullAttributesUser,
  ): Schema$HullAttributesUser {
    const changedAttribs: Schema$HullAttributesUser = {};

    const mappings = this.appSettings.user_mappings_quorum;

    forEach(mappings, (mapping: uaasV1.Schema$UnificationMappingBase) => {
      let quorumMembers: any[] = [];
      const mappingResult = this.handleMapping(user, mapping);
      if (isArray(mappingResult)) {
        quorumMembers.push(...mappingResult);
      } else {
        quorumMembers.push(mappingResult);
      }

      quorumMembers = compact(quorumMembers);
      if (quorumMembers.length === 0) {
        return changedAttribs;
      }
      const simpleMajorityResult = this.determineSimpleMajority(quorumMembers);
      set(
        changedAttribs,
        mapping.name.replace("traits_", ""),
        simpleMajorityResult.value,
      );
      set(
        changedAttribs,
        `${mapping.name.replace("traits_", "")}_confidence`,
        simpleMajorityResult.confidence,
      );
    });

    return changedAttribs;
  }

  public handleAccount(
    account: Schema$HullAttributesAccount,
  ): Schema$HullAttributesAccount {
    const changedAttribs: Schema$HullAttributesAccount = {};

    const mappings = this.appSettings.account_mappings_quorum;

    forEach(mappings, (mapping: uaasV1.Schema$UnificationMappingBase) => {
      const mappingResult = this.handleMapping(account, mapping);
      let quorumMembers: any[] = [];
      if (isArray(mappingResult)) {
        quorumMembers.push(...mappingResult);
      } else {
        quorumMembers.push(mappingResult);
      }

      quorumMembers = compact(quorumMembers);

      if (quorumMembers.length === 0) {
        return changedAttribs;
      }

      const simpleMajorityResult = this.determineSimpleMajority(quorumMembers);
      set(changedAttribs, mapping.name, simpleMajorityResult.value);
      set(
        changedAttribs,
        `${mapping.name}_confidence`,
        simpleMajorityResult.confidence,
      );
    });

    return changedAttribs;
  }

  private handleMapping(
    hullObject: Schema$HullAttributesCommon,
    mapping: uaasV1.Schema$UnificationMappingBase,
  ): any {
    const { normalization_method } = mapping;
    let normalizationMethod = "NONE";
    if (!isNil(normalization_method)) {
      normalizationMethod = normalization_method;
    }
    const normalizedValues: any[] = [];

    forEach(mapping.sources, (source: string) => {
      const attribVal = get(hullObject, source, null);
      let normalizedVal;
      switch (normalizationMethod) {
        case "PHONE_INTERNATIONAL":
        case "PHONE_E164":
          // Note: Those are special because we need the country parameter.
          //       It's best effort in this case only, so we take unified/country and as fallbac unified/country_code
          normalizedVal = this.normalizationHandler.handleNormalization(
            attribVal,
            normalizationMethod,
            get(
              hullObject,
              "unified/country",
              get(
                hullObject,
                "unified/country_code",
                get(
                  hullObject,
                  "traits_unified/country",
                  get(hullObject, "traits_unified/country_code", null),
                ),
              ),
            ),
          );
          break;
        default:
          normalizedVal = this.normalizationHandler.handleNormalization(
            attribVal,
            normalizationMethod,
          );
          break;
      }

      if (isArray(normalizedVal)) {
        normalizedValues.push(...normalizedVal);
      } else {
        normalizedValues.push(normalizedVal);
      }
    });

    return normalizedValues;
  }

  private determineSimpleMajority(
    quorumMembers: any[],
  ): { value: any; confidence: number } {
    const result = {
      value: null,
      confidence: 0,
    };

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
      result.value = quorumDecision.key;
    }

    result.confidence = Math.round(quorumConfidence * 100);
    return result;
  }
}
