import { Schema$HullAttributesCommon } from "../../src/definitions/hull/hull-objects";
import { DiffHelpers } from "../../src/services/uaas/diff-helpers";

describe("DiffHelpers", () => {
  describe("#diffUserAttributes()", () => {
    it("should only return different attributes", () => {
      // Arrange
      const changedAttributes: Schema$HullAttributesCommon = {
        "unified/first_name": "John",
        "unified/first_name_confidence": 100,
        first_name: {
          value: "John",
          operation: "setIfNull",
        },
      };
      const currentAttributes: Schema$HullAttributesCommon = {
        "traits_unified/first_name": "John",
        "traits_unified/first_name_confidence": 75,
        first_name: "Jim",
      };
      // Act
      const actualResult = DiffHelpers.diffUserAttributes(
        currentAttributes,
        changedAttributes,
      );
      // Assert
      const expectedResult = {
        "unified/first_name_confidence": 100,
        first_name: {
          value: "John",
          operation: "setIfNull",
        },
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe("#diffAccountAttributes()", () => {
    it("should only return different attributes", () => {
      // Arrange
      const changedAttributes: Schema$HullAttributesCommon = {
        "unified/name": "Hull Inc",
        "unified/name_confidence": 75,
        name: {
          value: "Hull Inc",
          operation: "setIfNull",
        },
      };
      const currentAttributes: Schema$HullAttributesCommon = {
        "unified/name": "Hull",
        "unified/name_confidence": 50,
        name: "Hull",
      };
      // Act
      const actualResult = DiffHelpers.diffAccountAttributes(
        currentAttributes,
        changedAttributes,
      );
      // Assert
      const expectedResult = {
        "unified/name": "Hull Inc",
        "unified/name_confidence": 75,
        name: {
          value: "Hull Inc",
          operation: "setIfNull",
        },
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
