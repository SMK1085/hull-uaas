import { PriorityStrategyHandler } from "../../src/services/uaas/strategy-handlers/priority";
import { DEFAULT_SETTINGS } from "../helpers/app-settings";

describe("PriorityStrategyHandler", () => {
  describe("#constructor", () => {
    it("shoud initialize readonly fields", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      // Act
      const handler = new PriorityStrategyHandler({ hullAppSettings });

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

      hullAppSettings.user_mappings_priority = [
        {
          name: "traits_unified/first_name",
          sources: [
            "traits_salesforce_contact/first_name",
            "traits_salesforce_lead/first_name",
            "traits_hubspot/first_name",
          ],
          normalization_method: "NONE",
        },
      ];

      const hullObject = {
        "traits_salesforce_lead/first_name": "John",
        "traits_hubspot/first_name": "J",
      };

      const handler = new PriorityStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/first_name": "John",
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it("should unify the phone with method 'PHONE_INTERNATIONAL'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.user_mappings_priority = [
        {
          name: "traits_unified/phone",
          sources: [
            "traits_salesforce_contact/phone_number",
            "traits_hubspot/phone",
          ],
          normalization_method: "PHONE_INTERNATIONAL",
        },
      ];

      const hullObject = {
        "traits_salesforce_contact/phone_number": "+1 866-645-3210",
        "traits_hubspot/phone": "+1 866-645-0000",
        "traits_unified/country_code": "US",
      };

      const handler = new PriorityStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/phone": "+1 866-645-3210",
      };

      expect(actualResult).toEqual(expectedResult);
    });

    it("should unify the linkedin url with method 'LINKEDIN_URL'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.user_mappings_priority = [
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

      const handler = new PriorityStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/linkedin_url": "https://www.linkedin.com/in/john-doe",
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe("#handleAccount", () => {
    it("should unify the country with method 'COUNTRY_NAME_COMMON' and country_code with 'COUNTRY_CODE_CCA2'", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      hullAppSettings.account_mappings_priority = [
        {
          name: "unified/country",
          sources: [
            "traits_salesforce_contact/billing_country",
            "traits_salesforce_lead/billing_country",
            "traits_hubspot/country",
            "traits_clearbit/address_country",
          ],
          normalization_method: "COUNTRY_NAME_COMMON",
        },
        {
          name: "unified/country_code",
          sources: [
            "traits_salesforce_contact/billing_country",
            "traits_salesforce_lead/billing_country",
            "traits_hubspot/country",
            "traits_clearbit/address_country",
          ],
          normalization_method: "COUNTRY_CODE_CCA2",
        },
      ];

      const hullObject = {
        "traits_hubspot/country": "Germany",
        "traits_clearbit/address_country": "United States",
      };

      const handler = new PriorityStrategyHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleAccount(hullObject);

      // Assert
      const expectedResult = {
        "unified/country": "Germany",
        "unified/country_code": "DE",
      };

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
