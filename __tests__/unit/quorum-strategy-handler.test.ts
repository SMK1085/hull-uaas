import { QuorumStrategyHandler } from "../../src/services/uaas/strategy-handlers/quorum";
import { DEFAULT_SETTINGS } from "../helpers/app-settings";

describe("QuorumStrategyHandler", () => {
  describe("#constructor", () => {
    it("shoud initialize readonly fields", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      // Act
      const handler = new QuorumStrategyHandler({ hullAppSettings });

      // Assert
      expect(handler.appSettings).toBeDefined();
      expect(handler.normalizationHandler).toBeDefined();
    });
  });

  describe("#handleUser", () => {
    it("should unify the first_name with method 'NONE'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.user_mappings_quorum = [
        {
          name: "traits_unified/first_name",
          sources: [
            "traits_salesforce_lead/first_name",
            "traits_salesforce_contact/first_name",
            "traits_hubspot/first_name",
          ],
          normalization_method: "NONE",
        },
      ];

      const hullObject = {
        "traits_salesforce_lead/first_name": "J",
        "traits_salesforce_contact/first_name": "John",
        "traits_hubspot/first_name": "John",
      };

      const handler = new QuorumStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/first_name": "John",
        "unified/first_name_confidence": 67,
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it("should unify the phone with method 'PHONE_INTERNATIONAL'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.user_mappings_quorum = [
        {
          name: "traits_unified/phone",
          sources: [
            "traits_snov/phones",
            "traits_salesforce_contact/phone_number",
            "traits_hubspot/phone",
          ],
          normalization_method: "PHONE_INTERNATIONAL",
        },
      ];

      const hullObject = {
        "traits_snov/phones": ["866-645-3210", "888-645-3211"],
        "traits_salesforce_contact/phone_number": "+1 866-645-3210",
        "traits_hubspot/phone": "+1 866-645-3210",
        "traits_unified/country_code": "US",
      };

      const handler = new QuorumStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/phone": "+1 866-645-3210",
        "unified/phone_confidence": 75,
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it("should unify the linkedin url with method 'LINKEDIN_URL'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.user_mappings_quorum = [
        {
          name: "traits_unified/linkedin_url",
          sources: ["traits_clearbit/linkedin", "traits_snov/sociallink"],
          normalization_method: "LINKEDIN_URL",
        },
      ];

      const hullObject = {
        "traits_clearbit/linkedin": "https://www.linkedin.com/in/john-doe",
        "traits_snov/sociallink": "https://linkedin.com/in/john-carter",
      };

      const handler = new QuorumStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/linkedin_url": null,
        "unified/linkedin_url_confidence": 0,
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe("#handleAccount", () => {
    it("should unify the country with method 'COUNTRY_NAME_COMMON'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.account_mappings_quorum = [
        {
          name: "unified/country",
          sources: [
            "traits_salesforce_lead/billing_country",
            "traits_salesforce_contact/billing_country",
            "traits_hubspot/country",
            "traits_clearbit/address_country",
          ],
          normalization_method: "COUNTRY_NAME_COMMON",
        },
      ];

      const hullObject = {
        "traits_salesforce_contact/billing_country": "Germany",
        "traits_hubspot/country": "Germany",
        "traits_clearbit/address_country": "United States",
      };

      const handler = new QuorumStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleAccount(hullObject);

      // Assert
      const expectedResult = {
        "unified/country": "Germany",
        "unified/country_confidence": 67,
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
