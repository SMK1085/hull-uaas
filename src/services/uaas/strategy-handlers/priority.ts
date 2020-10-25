import { forEach, get, isNil, set } from "lodash";
import {
  Schema$HullAttributesAccount,
  Schema$HullAttributesCommon,
  Schema$HullAttributesUser,
} from "../../../definitions/hull/hull-objects";
import { uaasV1 } from "../../../definitions/uaas/v1";
import { NormalizationHandler } from "../normalization-handler";

export class PriorityStrategyHandler
  implements uaasV1.Resource$StrategyHandler {
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

    const mappings = this.appSettings.user_mappings_priority;
    forEach(mappings, (mapping: uaasV1.Schema$UnificationMappingBase) => {
      const mappingResult = this.handleMapping(user, mapping);
      set(changedAttribs, mapping.name.replace("traits_", ""), mappingResult);
    });

    return changedAttribs;
  }

  public handleAccount(
    account: Schema$HullAttributesAccount,
  ): Schema$HullAttributesAccount {
    const changedAttribs: Schema$HullAttributesAccount = {};

    const mappings = this.appSettings.account_mappings_priority;
    forEach(mappings, (mapping: uaasV1.Schema$UnificationMappingBase) => {
      const mappingResult = this.handleMapping(account, mapping);
      set(changedAttribs, mapping.name, mappingResult);
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

    let normalizedValue: any = null;
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

      if (!isNil(normalizedVal)) {
        normalizedValue = normalizedVal;
        return false;
      }
    });

    return normalizedValue;
  }
}
