import { UaasHelpers } from "../../src/services/uaas/uaas-helpers";

describe("UaasHelpers", () => {
  describe("#sanitizeUrlStringValue()", () => {
    it("should return an arbitrary string unchanged", () => {
      // Arrange
      const rawString = "test";

      // Act
      const actual = UaasHelpers.sanitizeUrlStringValue(rawString);

      // Assert
      const expected = "test";
      expect(actual).toEqual(expected);
    });

    it("should normalize a url with no protocol", () => {
      // Arrange
      const rawString = "facebook.com/demo";

      // Act
      const actual = UaasHelpers.sanitizeUrlStringValue(rawString);

      // Assert
      const expected = "https://facebook.com";
      expect(actual).toEqual(expected);
    });

    it("should normalize a url with http protocol", () => {
      // Arrange
      const rawString = "http://facebook.com/demo";

      // Act
      const actual = UaasHelpers.sanitizeUrlStringValue(rawString);

      // Assert
      const expected = "https://facebook.com";
      expect(actual).toEqual(expected);
    });

    it("should normalize a url with a hash", () => {
      // Arrange
      const rawString = "facebook.com/demo#foo=true";

      // Act
      const actual = UaasHelpers.sanitizeUrlStringValue(rawString);

      // Assert
      const expected = "https://facebook.com";
      expect(actual).toEqual(expected);
    });

    it("should normalize a url with a querystring", () => {
      // Arrange
      const rawString = "facebook.com/demo?foo=true&bar=baz";

      // Act
      const actual = UaasHelpers.sanitizeUrlStringValue(rawString);

      // Assert
      const expected = "https://facebook.com";
      expect(actual).toEqual(expected);
    });
  });

  describe("#sanitizeCountryCodeCca2()", () => {
    it("should not change a valid CCA2 code", () => {
      // Arrange
      const rawString = "DE";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased CCA2 code", () => {
      // Arrange
      const rawString = "de";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased CCA3 code", () => {
      // Arrange
      const rawString = "deu";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a valid CCA3 code", () => {
      // Arrange
      const rawString = "DEU";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a valid common country name", () => {
      // Arrange
      const rawString = "Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased common country name", () => {
      // Arrange
      const rawString = "germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a valid offical country name", () => {
      // Arrange
      const rawString = "Federal Republic of Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased official country name", () => {
      // Arrange
      const rawString = "federal republic of germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a valid common native country name", () => {
      // Arrange
      const rawString = "Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased common native country name", () => {
      // Arrange
      const rawString = "deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a valid offical native country name", () => {
      // Arrange
      const rawString = "Bundesrepublik Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA2 code for a lowercased official native country name", () => {
      // Arrange
      const rawString = "bundesrepublik deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      const expected = "DE";
      expect(actual).toEqual(expected);
    });

    it("should return undefined for an invalid CCA2 code", () => {
      // Arrange
      const rawString = "zz";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid CCA3 code", () => {
      // Arrange
      const rawString = "zzz";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid country name", () => {
      // Arrange
      const rawString = "zzzFooBar";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca2(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe("#sanitizeCountryCodeCca3()", () => {
    it("should return a valid CCA3 code for a valid CCA2 code", () => {
      // Arrange
      const rawString = "DE";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased CCA2 code", () => {
      // Arrange
      const rawString = "de";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased CCA3 code", () => {
      // Arrange
      const rawString = "deu";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a valid CCA3 code", () => {
      // Arrange
      const rawString = "DEU";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a valid common country name", () => {
      // Arrange
      const rawString = "Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased common country name", () => {
      // Arrange
      const rawString = "germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a valid offical country name", () => {
      // Arrange
      const rawString = "Federal Republic of Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased official country name", () => {
      // Arrange
      const rawString = "federal republic of germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a valid common native country name", () => {
      // Arrange
      const rawString = "Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased common native country name", () => {
      // Arrange
      const rawString = "deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a valid offical native country name", () => {
      // Arrange
      const rawString = "Bundesrepublik Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return a valid CCA3 code for a lowercased official native country name", () => {
      // Arrange
      const rawString = "bundesrepublik deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      const expected = "DEU";
      expect(actual).toEqual(expected);
    });

    it("should return undefined for an invalid CCA2 code", () => {
      // Arrange
      const rawString = "zz";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid CCA3 code", () => {
      // Arrange
      const rawString = "zzz";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid country name", () => {
      // Arrange
      const rawString = "zzzFooBar";

      // Act
      const actual = UaasHelpers.sanitizeCountryCodeCca3(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe("#sanitizeCountryNameCommon()", () => {
    it("should return a valid common name in english for a valid CCA2 code", () => {
      // Arrange
      const rawString = "DE";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased CCA2 code", () => {
      // Arrange
      const rawString = "de";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased CCA3 code", () => {
      // Arrange
      const rawString = "deu";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a valid CCA3 code", () => {
      // Arrange
      const rawString = "DEU";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a valid common country name", () => {
      // Arrange
      const rawString = "Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased common country name", () => {
      // Arrange
      const rawString = "germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a valid offical country name", () => {
      // Arrange
      const rawString = "Federal Republic of Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased official country name", () => {
      // Arrange
      const rawString = "federal republic of germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a valid common native country name", () => {
      // Arrange
      const rawString = "Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased common native country name", () => {
      // Arrange
      const rawString = "deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a valid offical native country name", () => {
      // Arrange
      const rawString = "Bundesrepublik Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid common name in english code for a lowercased official native country name", () => {
      // Arrange
      const rawString = "bundesrepublik deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      const expected = "Germany";
      expect(actual).toEqual(expected);
    });

    it("should return undefined for an invalid CCA2 code", () => {
      // Arrange
      const rawString = "zz";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid CCA3 code", () => {
      // Arrange
      const rawString = "zzz";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid country name", () => {
      // Arrange
      const rawString = "zzzFooBar";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameCommon(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe("#sanitizeCountryNameOfficial()", () => {
    it("should return a valid official name in english for a valid CCA2 code", () => {
      // Arrange
      const rawString = "DE";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased CCA2 code", () => {
      // Arrange
      const rawString = "de";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased CCA3 code", () => {
      // Arrange
      const rawString = "deu";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a valid CCA3 code", () => {
      // Arrange
      const rawString = "DEU";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a valid common country name", () => {
      // Arrange
      const rawString = "Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased common country name", () => {
      // Arrange
      const rawString = "germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a valid offical country name", () => {
      // Arrange
      const rawString = "Federal Republic of Germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased official country name", () => {
      // Arrange
      const rawString = "federal republic of germany";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a valid common native country name", () => {
      // Arrange
      const rawString = "Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased common native country name", () => {
      // Arrange
      const rawString = "deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a valid offical native country name", () => {
      // Arrange
      const rawString = "Bundesrepublik Deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return a valid official name in english code for a lowercased official native country name", () => {
      // Arrange
      const rawString = "bundesrepublik deutschland";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      const expected = "Federal Republic of Germany";
      expect(actual).toEqual(expected);
    });

    it("should return undefined for an invalid CCA2 code", () => {
      // Arrange
      const rawString = "zz";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid CCA3 code", () => {
      // Arrange
      const rawString = "zzz";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });

    it("should return undefined for an invalid country name", () => {
      // Arrange
      const rawString = "zzzFooBar";

      // Act
      const actual = UaasHelpers.sanitizeCountryNameOfficial(rawString);

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe("#getCountryInfoForTld()", () => {
    it("should return undefined if tld doesn't start with a dot", () => {
      // Arrange
      const rawString = "de";

      // Act
      const actual = UaasHelpers.getCountryInfoForTld(rawString, "CCA2");

      // Assert
      expect(actual).toBeUndefined();
    });
  });

  describe("#normalizePhoneNumberInternational()", () => {
    it("should format a semi-international format number without country code", () => {
      // Arrange
      const rawString = "+1-662-226-1901";
      const countryCode = undefined;

      // Act
      const actual = UaasHelpers.normalizePhoneNumberInternational(
        rawString,
        countryCode,
      );

      // Assert
      const expectedString = "+1 662-226-1901";
      expect(actual).toEqual(expectedString);
    });

    it("should format a semi-international format number with country code", () => {
      // Arrange
      const rawString = "+1-662-226-1901";
      const countryCode = "US";

      // Act
      const actual = UaasHelpers.normalizePhoneNumberInternational(
        rawString,
        countryCode,
      );

      // Assert
      const expectedString = "+1 662-226-1901";
      expect(actual).toEqual(expectedString);
    });

    it("should not format a national format number without country code", () => {
      // Arrange
      const rawString = "(662) 226-1901";
      const countryCode = undefined;

      // Act
      const actual = UaasHelpers.normalizePhoneNumberInternational(
        rawString,
        countryCode,
      );

      // Assert
      const expectedString = "(662) 226-1901";
      expect(actual).toEqual(expectedString);
    });

    it("should format a national format number with country code", () => {
      // Arrange
      const rawString = "(662) 226-1901";
      const countryCode = "US";

      // Act
      const actual = UaasHelpers.normalizePhoneNumberInternational(
        rawString,
        countryCode,
      );

      // Assert
      const expectedString = "+1 662-226-1901";
      expect(actual).toEqual(expectedString);
    });
  });
});
