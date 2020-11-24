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

    describe("for method 'INT'", () => {
      const normalizationMethod = "INT";
      const testCases = [
        {
          description: "should return an integer if input as an integer",
          attribVal: 1,
          params: undefined,
          expectedVal: 1,
        },
        {
          description: "should return an integer if input as a float",
          attribVal: 2.435648,
          params: undefined,
          expectedVal: 2,
        },
        {
          description:
            "should return an integer if input as a stringified integer",
          attribVal: "2015",
          params: undefined,
          expectedVal: 2015,
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a boolean",
          attribVal: false,
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
        {
          description:
            "should return an array of integers if input as an array of integers",
          attribVal: [0, 1, 20, 999, -1],
          params: undefined,
          expectedVal: [0, 1, 20, 999, -1],
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

    describe("for method 'FLOAT'", () => {
      const normalizationMethod = "FLOAT";
      const testCases = [
        {
          description: "should return a float if input as a float",
          attribVal: 1.567,
          params: undefined,
          expectedVal: 1.567,
        },
        {
          description: "should return a float if input as an integer",
          attribVal: 2,
          params: undefined,
          expectedVal: 2,
        },
        {
          description: "should return a float if input as a stringified float",
          attribVal: "99.756",
          params: undefined,
          expectedVal: 99.756,
        },
        {
          description: "should return undefined if input is null",
          attribVal: null,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a boolean",
          attribVal: false,
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
        {
          description:
            "should return an array of floats if input as an array of floats",
          attribVal: [0.1235, 1.23, 20.2, 999.978, -1.54631],
          params: undefined,
          expectedVal: [0.1235, 1.23, 20.2, 999.978, -1.54631],
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

    describe("for method 'LOWERCASE'", () => {
      const normalizationMethod = "LOWERCASE";
      const testCases = [
        {
          description: "should return a lowercased string for '--Foo-Bar--'",
          attribVal: "--Foo-Bar--",
          params: undefined,
          expectedVal: "foo bar",
        },
        {
          description: "should return a lowercased string for 'fooBar'",
          attribVal: "fooBar",
          params: undefined,
          expectedVal: "foo bar",
        },
        {
          description: "should return a lowercased string for '__FOO_BAR__'",
          attribVal: "__FOO_BAR__",
          params: undefined,
          expectedVal: "foo bar",
        },
        {
          description: "should return a lowercased string for 'FOO'",
          attribVal: "FOO",
          params: undefined,
          expectedVal: "foo",
        },
        {
          description: "should return a lowercased string for 'foo bar'",
          attribVal: "foo bar",
          params: undefined,
          expectedVal: "foo bar",
        },
        {
          description: "should return undefined if input is a boolean",
          attribVal: false,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12453.56,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of lowercased strings if input as an array of strings",
          attribVal: ["--Foo-Bar--", "fooBar", "__FOO_BAR__", "FOO", "foo bar"],
          params: undefined,
          expectedVal: ["foo bar", "foo bar", "foo bar", "foo", "foo bar"],
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

    describe("for method 'UPPERCASE'", () => {
      const normalizationMethod = "UPPERCASE";
      const testCases = [
        {
          description: "should return a uppercased string for '--foo-bar--'",
          attribVal: "--foo-bar--",
          params: undefined,
          expectedVal: "FOO BAR",
        },
        {
          description: "should return a uppercased string for 'fooBar'",
          attribVal: "fooBar",
          params: undefined,
          expectedVal: "FOO BAR",
        },
        {
          description: "should return a uppercased string for '__foo_bar__'",
          attribVal: "__foo_bar__",
          params: undefined,
          expectedVal: "FOO BAR",
        },
        {
          description: "should return a uppercased string for 'foo'",
          attribVal: "foo",
          params: undefined,
          expectedVal: "FOO",
        },
        {
          description: "should return a uppercased string for 'FOO BAR'",
          attribVal: "FOO BAR",
          params: undefined,
          expectedVal: "FOO BAR",
        },
        {
          description: "should return undefined if input is a boolean",
          attribVal: false,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12453.56,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of uppercased strings if input as an array of strings",
          attribVal: ["--foo-bar--", "fooBar", "__foo_bar__", "foo", "FOO BAR"],
          params: undefined,
          expectedVal: ["FOO BAR", "FOO BAR", "FOO BAR", "FOO", "FOO BAR"],
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

    describe("for method 'STARTCASE'", () => {
      const normalizationMethod = "STARTCASE";
      const testCases = [
        {
          description: "should return a startcased string for '--Foo-Bar--'",
          attribVal: "--Foo-Bar--",
          params: undefined,
          expectedVal: "Foo Bar",
        },
        {
          description: "should return a startcased string for 'fooBar'",
          attribVal: "fooBar",
          params: undefined,
          expectedVal: "Foo Bar",
        },
        {
          description: "should return a startcased string for '__FOO_BAR__'",
          attribVal: "__FOO_BAR__",
          params: undefined,
          expectedVal: "Foo Bar",
        },
        {
          description: "should return a startcased string for 'FOO'",
          attribVal: "FOO",
          params: undefined,
          expectedVal: "Foo",
        },
        {
          description: "should return a startcased string for 'Foo Bar'",
          attribVal: "Foo Bar",
          params: undefined,
          expectedVal: "Foo Bar",
        },
        {
          description: "should return undefined if input is a boolean",
          attribVal: false,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description: "should return undefined if input is a number",
          attribVal: 12453.56,
          params: undefined,
          expectedVal: undefined,
        },
        {
          description:
            "should return an array of startcased strings if input as an array of strings",
          attribVal: ["--Foo-Bar--", "fooBar", "__FOO_BAR__", "FOO", "foo bar"],
          params: undefined,
          expectedVal: ["Foo Bar", "Foo Bar", "Foo Bar", "Foo", "Foo Bar"],
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
