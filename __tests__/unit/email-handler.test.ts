import { EmailHandler } from "../../src/services/uaas/data-quality/email";
import { DEFAULT_SETTINGS } from "../helpers/app-settings";

describe("EmailHandler", () => {
  describe("#constructor", () => {
    it("shoud initialize readonly fields", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };

      // Act
      const handler = new EmailHandler({ hullAppSettings });

      // Assert
      expect(handler.appSettings).toBeDefined();
    });
  });

  describe("#handleUser", () => {
    it("should not execute if the feature is not activated", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
      };
      const hullObject = {
        "unified/email": "john.doe@hulldx.com",
        email: "john.doe@hulldx.com",
      };

      const handler = new EmailHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {};
      expect(actualResult).toEqual(expectedResult);
    });

    it("should handle an email which is neither one properly", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
        user_freemail_enabled: true,
      };
      const hullObject = {
        "unified/email": "john.doe@hulldx.com",
        email: "john.doe@hulldx.com",
      };

      const handler = new EmailHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/emailcheck_email": hullObject.email,
        "unified/emailcheck_isfreemail": false,
        "unified/emailcheck_isdisposable": false,
        "unified/emailcheck_isblacklist": false,
      };
      expect(actualResult).toEqual(expectedResult);
    });

    it("should handle an email which is a freemail only properly", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
        user_freemail_enabled: true,
      };
      const hullObject = {
        "unified/email": "john.doe@hulldx.com",
        email: "john.doe@gmail.com",
      };

      const handler = new EmailHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/emailcheck_email": hullObject.email,
        "unified/emailcheck_isfreemail": true,
        "unified/emailcheck_isdisposable": false,
        "unified/emailcheck_isblacklist": false,
      };
      expect(actualResult).toEqual(expectedResult);
    });

    it("should handle an email which is disposable properly", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
        user_freemail_enabled: true,
      };
      const hullObject = {
        "unified/email": "john.doe@hulldx.com",
        email: "john.doe@10minutemail.com",
      };

      const handler = new EmailHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/emailcheck_email": hullObject.email,
        "unified/emailcheck_isfreemail": true,
        "unified/emailcheck_isdisposable": true,
        "unified/emailcheck_isblacklist": false,
      };
      expect(actualResult).toEqual(expectedResult);
    });

    it("should handle an email which has a blacklisted domain only properly", () => {
      // Arrange
      const hullAppSettings = {
        ...DEFAULT_SETTINGS,
        user_freemail_enabled: true,
        user_freemail_blacklist: ["sfr.com"],
      };
      const hullObject = {
        "unified/email": "john.doe@hulldx.com",
        email: "john.doe@sfr.com",
      };

      const handler = new EmailHandler({ hullAppSettings });

      // Act
      const actualResult = handler.handleUser(hullObject);

      // Assert
      const expectedResult = {
        "unified/emailcheck_email": hullObject.email,
        "unified/emailcheck_isfreemail": false,
        "unified/emailcheck_isdisposable": false,
        "unified/emailcheck_isblacklist": true,
      };
      expect(actualResult).toEqual(expectedResult);
    });
  });
});
