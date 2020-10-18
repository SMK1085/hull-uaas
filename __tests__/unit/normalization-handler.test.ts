import { NormalizationHandler } from "../../src/services/uaas/normalization-handler";
import { NORMALIZATION_AVAILABLEMETHODS } from "../../src/config/meta-normalization";

describe("NormalizationHandler", () => {
  describe("#constructor()", () => {
    it("should register all available methods", () => {
      // Arrange
      // Act
      const handler = new NormalizationHandler();

      // Assert
      const availableMethods = NORMALIZATION_AVAILABLEMETHODS;
      expect(Object.keys(handler.registeredMethods).length).toEqual(
        availableMethods.length,
      );
    });
  });

  describe("#handleNormalization()", () => {
    describe("for method 'FOO' (invalid method)", () => {
      const normalizationMethod = "FOO";
      it("should throw an error", () => {
        // Arrange
        const attribVal = "foo";
        const handler = new NormalizationHandler();

        expect(() =>
          handler.handleNormalization(attribVal, normalizationMethod),
        ).toThrow(
          `Normalization method '${normalizationMethod}' is not registered. Allowed methods are ${Object.keys(
            handler.registeredMethods,
          ).join(", ")}.`,
        );
      });
    });

    describe("for method 'NONE'", () => {
      const normalizationMethod = "NONE";
      it("should not modify a passed in value", () => {
        // Arrange
        const attribVal = "foo";
        const handler = new NormalizationHandler();

        // Act
        const actualVal = handler.handleNormalization(
          attribVal,
          normalizationMethod,
        );

        // Assert
        expect(actualVal).toEqual(attribVal);
      });
    });

    describe("for method 'COUNTRY_NAME_COMMON'", () => {
      const normalizationMethod = "COUNTRY_NAME_COMMON";
      const testCases = [
        {
          description:
            "should return a valid common name in english for a valid CCA2 code",
          attribVal: "DE",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased CCA2 code",
          attribVal: "de",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a valid CCA3 code",
          attribVal: "DEU",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased CCA3 code",
          attribVal: "deu",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a valid common country name",
          attribVal: "Germany",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased common country name",
          attribVal: "germany",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a valid offical country name",
          attribVal: "Federal Republic of Germany",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased offical country name",
          attribVal: "federal republic of germany",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a valid native common country name",
          attribVal: "Deutschland",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased native common country name",
          attribVal: "deutschland",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a valid native official country name",
          attribVal: "Bundesrepublik Deutschland",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description:
            "should return a valid common name in english for a lowercased native official country name",
          attribVal: "bundesrepublik deutschland",
          params: undefined,
          expectedVal: "Germany",
        },
        {
          description: "should return undefined for some arbitrary string",
          attribVal: "the black Brown fox jumps over the ground",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined for a null attribute value",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of valid common names in english for an array of valid CCA2 codes",
          attribVal: ["DE", "FR"],
          params: undefined,
          expectedVal: ["Germany", "France"],
        },
        {
          description:
            "should return an array of valid common names in english for an mixed array",
          attribVal: ["DE", "blurb Foo"],
          params: undefined,
          expectedVal: ["Germany", undefined],
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'COUNTRY_NAME_OFFICIAL'", () => {
      const normalizationMethod = "COUNTRY_NAME_OFFICIAL";
      const testCases = [
        {
          description:
            "should return a valid official name in english for a valid CCA2 code",
          attribVal: "DE",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased CCA2 code",
          attribVal: "de",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a valid CCA3 code",
          attribVal: "DEU",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased CCA3 code",
          attribVal: "deu",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a valid common country name",
          attribVal: "Germany",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased common country name",
          attribVal: "germany",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a valid offical country name",
          attribVal: "Federal Republic of Germany",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased offical country name",
          attribVal: "federal republic of germany",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a valid native common country name",
          attribVal: "Deutschland",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased native common country name",
          attribVal: "deutschland",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a valid native official country name",
          attribVal: "Bundesrepublik Deutschland",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description:
            "should return a valid official name in english for a lowercased native official country name",
          attribVal: "bundesrepublik deutschland",
          params: undefined,
          expectedVal: "Federal Republic of Germany",
        },
        {
          description: "should return undefined for some arbitrary string",
          attribVal: "the black Brown fox jumps over the ground",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined for a null attribute value",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of valid official names in english for an array of valid CCA2 codes",
          attribVal: ["DE", "US"],
          params: undefined,
          expectedVal: [
            "Federal Republic of Germany",
            "United States of America",
          ],
        },
        {
          description:
            "should return an array of valid official names in english for an mixed array",
          attribVal: ["DE", "blurb Foo"],
          params: undefined,
          expectedVal: ["Federal Republic of Germany", undefined],
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'COUNTRY_CODE_CCA2'", () => {
      const normalizationMethod = "COUNTRY_CODE_CCA2";
      const testCases = [
        {
          description: "should return a valid CCA2 code for a valid CCA2 code",
          attribVal: "DE",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased CCA2 code",
          attribVal: "de",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description: "should return a valid CCA2 code for a valid CCA3 code",
          attribVal: "DEU",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased CCA3 code",
          attribVal: "deu",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a valid common country name",
          attribVal: "Germany",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased common country name",
          attribVal: "germany",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a valid offical country name",
          attribVal: "Federal Republic of Germany",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased offical country name",
          attribVal: "federal republic of germany",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a valid native common country name",
          attribVal: "Deutschland",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased native common country name",
          attribVal: "deutschland",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a valid native official country name",
          attribVal: "Bundesrepublik Deutschland",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description:
            "should return a valid CCA2 code for a lowercased native official country name",
          attribVal: "bundesrepublik deutschland",
          params: undefined,
          expectedVal: "DE",
        },
        {
          description: "should return undefined for some arbitrary string",
          attribVal: "the black Brown fox jumps over the ground",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined for a null attribute value",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of valid CCA2 codes for an array of valid CCA2 codes",
          attribVal: ["DE", "US"],
          params: undefined,
          expectedVal: ["DE", "US"],
        },
        {
          description:
            "should return an array of valid CCA2 codes for an mixed array",
          attribVal: ["DE", "blurb Foo"],
          params: undefined,
          expectedVal: ["DE", undefined],
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'COUNTRY_CODE_CCA3'", () => {
      const normalizationMethod = "COUNTRY_CODE_CCA3";
      const testCases = [
        {
          description: "should return a valid CCA3 code for a valid CCA2 code",
          attribVal: "DE",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased CCA2 code",
          attribVal: "de",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description: "should return a valid CCA3 code for a valid CCA3 code",
          attribVal: "DEU",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased CCA3 code",
          attribVal: "deu",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a valid common country name",
          attribVal: "Germany",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased common country name",
          attribVal: "germany",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a valid offical country name",
          attribVal: "Federal Republic of Germany",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased offical country name",
          attribVal: "federal republic of germany",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a valid native common country name",
          attribVal: "Deutschland",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased native common country name",
          attribVal: "deutschland",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a valid native official country name",
          attribVal: "Bundesrepublik Deutschland",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description:
            "should return a valid CCA3 code for a lowercased native official country name",
          attribVal: "bundesrepublik deutschland",
          params: undefined,
          expectedVal: "DEU",
        },
        {
          description: "should return undefined for some arbitrary string",
          attribVal: "the black Brown fox jumps over the ground",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined for a null attribute value",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of valid CCA3 codes for an array of valid CCA2 codes",
          attribVal: ["DE", "US"],
          params: undefined,
          expectedVal: ["DEU", "USA"],
        },
        {
          description:
            "should return an array of valid CCA3 codes for an mixed array",
          attribVal: ["DE", "blurb Foo"],
          params: undefined,
          expectedVal: ["DEU", undefined],
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'DOMAIN'", () => {
      const normalizationMethod = "DOMAIN";
      const testCases = [
        {
          description:
            "should return a domain for a valid url without subdomain",
          attribVal: "https://microsoft.com",
          params: undefined,
          expectedVal: "microsoft.com",
        },
        {
          description:
            "should return a domain for a valid url with www subdomain",
          attribVal: "https://www.microsoft.com",
          params: undefined,
          expectedVal: "microsoft.com",
        },
        {
          description:
            "should return a domain for a valid url with a non-www subdomain",
          attribVal: "https://office.microsoft.com",
          params: undefined,
          expectedVal: "office.microsoft.com",
        },
        {
          description: "should return a domain for a valid domain",
          attribVal: "microsoft.com",
          params: undefined,
          expectedVal: "microsoft.com",
        },
        {
          description:
            "should return a domain for a url without protocol but with a www subdomain",
          attribVal: "www.microsoft.com",
          params: undefined,
          expectedVal: "microsoft.com",
        },
        {
          description:
            "should return an array of domains for a mixed array of urls, domains and arbitrary strings",
          attribVal: [
            "www.microsoft.com",
            "https://office.microsoft.com",
            "http://google.com",
            "some Foo",
          ],
          params: undefined,
          expectedVal: [
            "microsoft.com",
            "office.microsoft.com",
            "google.com",
            undefined,
          ],
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12345,
          params: undefined,
          expectedVal: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'WEBSITE'", () => {
      const normalizationMethod = "WEBSITE";
      const testCases = [
        {
          description:
            "should return a website url for a valid url without subdomain",
          attribVal: "https://microsoft.com",
          params: undefined,
          expectedVal: "https://microsoft.com",
        },
        {
          description:
            "should return a website url for a valid url with www subdomain",
          attribVal: "https://www.microsoft.com",
          params: undefined,
          expectedVal: "https://microsoft.com",
        },
        {
          description:
            "should return a website url for a valid url with a non-www subdomain",
          attribVal: "https://office.microsoft.com",
          params: undefined,
          expectedVal: "https://office.microsoft.com",
        },
        {
          description: "should return a website url for a http url with path",
          attribVal: "http://microsoft.com/en-US",
          params: undefined,
          expectedVal: "https://microsoft.com",
        },
        {
          description:
            "should return a website url for a url without protocol but with a www subdomain",
          attribVal: "www.microsoft.com",
          params: undefined,
          expectedVal: "https://microsoft.com",
        },
        {
          description:
            "should return an array of domains for a mixed array of urls, domains and arbitrary strings",
          attribVal: [
            "www.microsoft.com",
            "https://office.microsoft.com",
            "http://google.com",
            "some Foo",
          ],
          params: undefined,
          expectedVal: [
            "https://microsoft.com",
            "https://office.microsoft.com",
            "https://google.com",
            undefined,
          ],
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12345,
          params: undefined,
          expectedVal: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'LINKEDIN_URL'", () => {
      const normalizationMethod = "LINKEDIN_URL";
      const testCases = [
        {
          description:
            "should return a linkedin url if input is a valid linkedin link",
          attribVal: "https://linkedin.com/in/john-doe",
          params: undefined,
          expectedVal: "https://www.linkedin.com/in/john-doe",
        },
        {
          description: "should return undefined for an arbitrary url",
          attribVal: "https://www.microsoft.com",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return a linkedin url if input is a valid linkedin url",
          attribVal: "https://www.linkedin.com/in/john-doe",
          params: undefined,
          expectedVal: "https://www.linkedin.com/in/john-doe",
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12345,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return undefined if input is an arbitrary string",
          attribVal: "the quick brown fox",
          params: undefined,
          expectedVal: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'FACEBOOK_URL'", () => {
      const normalizationMethod = "FACEBOOK_URL";
      const testCases = [
        {
          description:
            "should return a facebook url if input is a valid facebook link",
          attribVal: "https://facebook.com/john-doe",
          params: undefined,
          expectedVal: "https://www.facebook.com/john-doe",
        },
        {
          description: "should return undefined for an arbitrary url",
          attribVal: "https://www.microsoft.com",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return a facebook url if input is a valid facebook url",
          attribVal: "https://www.facebook.com/john-doe",
          params: undefined,
          expectedVal: "https://www.facebook.com/john-doe",
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12345,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return undefined if input is an arbitrary string",
          attribVal: "the quick brown fox",
          params: undefined,
          expectedVal: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });

    describe("for method 'TWITTER_URL'", () => {
      const normalizationMethod = "TWITTER_URL";
      const testCases = [
        {
          description:
            "should return a twitter url if input is a valid twitter link",
          attribVal: "https://twitter.com/johndoe",
          params: undefined,
          expectedVal: "https://twitter.com/johndoe",
        },
        {
          description: "should return undefined for an arbitrary url",
          attribVal: "https://www.microsoft.com",
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return a twitter url if input is a valid twitter url",
          attribVal: "https://www.twitter.com/johndoe",
          params: undefined,
          expectedVal: "https://twitter.com/johndoe",
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12345,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return undefined if input is an arbitrary string",
          attribVal: "the quick brown fox",
          params: undefined,
          expectedVal: undefined,
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          // Arrange
          const handler = new NormalizationHandler();

          // Act
          const actualVal = handler.handleNormalization(
            testCase.attribVal,
            normalizationMethod,
          );

          // Assert
          expect(actualVal).toEqual(testCase.expectedVal);
        });
      });
    });
  });
});
