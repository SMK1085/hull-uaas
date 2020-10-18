import {
  Schema$HullAttributesUser,
  Schema$HullAttributesAccount,
} from "../../definitions/hull/hull-objects";
import { isNil, get, set, forIn } from "lodash";

export class DiffHelpers {
  public static diffUserAttributes(
    currentAttributes: Schema$HullAttributesUser,
    changedAttributes: Schema$HullAttributesUser,
  ): Schema$HullAttributesUser {
    const diffedAttributes: Schema$HullAttributesUser = {};
    forIn(changedAttributes, (v, k) => {
      if (!isNil(get(v, "value", null)) && !isNil(get(v, "operation", null))) {
        if (
          get(v, "value") !==
          get(currentAttributes, k, get(currentAttributes, `traits_${k}`, null))
        ) {
          set(diffedAttributes, k, v);
        }
      } else if (isNil(get(v, "operation", null))) {
        if (
          v !==
          get(currentAttributes, k, get(currentAttributes, `traits_${k}`, null))
        ) {
          set(diffedAttributes, k, v);
        }
      }
    });

    return diffedAttributes;
  }

  public static diffAccountAttributes(
    currentAttributes: Schema$HullAttributesAccount,
    changedAttributes: Schema$HullAttributesAccount,
  ): Schema$HullAttributesAccount {
    const diffedAttributes: Schema$HullAttributesAccount = {};
    forIn(changedAttributes, (v, k) => {
      if (!isNil(get(v, "value", null)) && !isNil(get(v, "operation", null))) {
        if (get(v, "value") !== get(currentAttributes, k, null)) {
          set(diffedAttributes, k, v);
        }
      } else if (isNil(get(v, "operation", null))) {
        if (v !== get(currentAttributes, k, null)) {
          set(diffedAttributes, k, v);
        }
      }
    });

    return diffedAttributes;
  }
}
