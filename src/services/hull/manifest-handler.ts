import { Request, Response } from "express";
import {
  HullIncomingIdentityMapping,
  HullAttributeMapping,
  HullConnectorSetting,
  HullConnectorSchedule,
  HullConnectorSubscription,
  HullConnectorSettingsSection,
  HullConnectorManifest,
} from "../../definitions/hull/hull-connector";
import packageInfo from "../../../package.json";
import { routes } from "../routes";
import { Route } from "../../definitions/express/express-route";
import { schedules } from "../../config/scheduling";
import {
  settingsSections,
  jsonSettings,
  privateSettings,
} from "../../config/settings";

export interface ConnectorSettings {
  // Incoming: User
  incoming_user_identity: HullIncomingIdentityMapping[];
  incoming_user_attributemapping: HullAttributeMapping[];
  // Outgoing: User
  outgoing_user_segments: string[];
  outgoing_user_attributemapping: HullAttributeMapping[];
  // Incoming: Account
  incoming_account_identity: HullIncomingIdentityMapping[];
  incoming_account_attributemapping: HullAttributeMapping[];
  // Outgoing: Account
  outgoing_account_segments: string[];
  outgoing_account_attributemapping: HullAttributeMapping[];
  // OAuth
  oauth_access_token?: string | null;
  oauth_refresh_token?: string | null;
  oauth_expires_after?: string | null;
}

const defineTags = (): string[] => {
  const tags: string[] = ["oneColumn"];
  routes.forEach((r: Route) => {
    if (r.path.includes("smart-notifier")) {
      if (!tags.includes("smart-notifier")) {
        tags.push("smart-notifier");
      }
      if (!tags.includes("outgoing")) {
        tags.push("outgoing");
      }
    } else if (r.path.includes("batch")) {
      if (!tags.includes("batch")) {
        tags.push("batch");
      }
      if (!tags.includes("outgoing")) {
        tags.push("outgoing");
      }
    } else if (r.path.includes("batch-accounts")) {
      if (!tags.includes("batch-accounts")) {
        tags.push("batch-accounts");
      }
      if (!tags.includes("outgoing")) {
        tags.push("outgoing");
      }
    }
  });

  return tags;
};

const definePrivateSettings = (): HullConnectorSetting[] => {
  const settings: HullConnectorSetting[] = [];

  privateSettings.forEach((s) => {
    // Todo: Validate setting
    settings.push(s);
  });

  return settings;
};

const defineSchedules = (): HullConnectorSchedule[] => {
  const configuredSchedules: HullConnectorSchedule[] = [];

  routes.forEach((r: Route) => {
    const routeSchedule = schedules.find((s) => {
      return s.url === r.path;
    });

    if (routeSchedule) {
      configuredSchedules.push(routeSchedule);
    }
  });

  return schedules;
};

const defineSubscriptions = (): HullConnectorSubscription[] => {
  const configuredSubs: HullConnectorSubscription[] = [];
  routes.forEach((r: Route) => {
    if (r.path.includes("smart-notifier")) {
      configuredSubs.push({
        url: r.path,
      });
    }
  });
  return configuredSubs;
};

const defineSettingSections = (
  composedManifest: HullConnectorManifest,
): HullConnectorSettingsSection[] => {
  const configuredSections: HullConnectorSettingsSection[] = [];

  settingsSections.forEach((s) => {
    // Todo: Validate with settings
    configuredSections.push(s);
  });

  return configuredSections;
};

const defineJsonSettings = (composedManifest: HullConnectorManifest): any[] => {
  const configuredSettings: any[] = [];
  jsonSettings.forEach((s) => {
    // Todo: Validate with routes
    configuredSettings.push(s);
  });

  return configuredSettings;
};

export const handleManifest = (req: Request, res: Response): void => {
  const composedManifest: HullConnectorManifest = {
    name: process.env.HULLDX_APP_NAME || packageInfo.name,
    tags: defineTags(),
    description: process.env.HULLDX_APP_DESCRIPTION || packageInfo.description,
    tabs: [],
    version: packageInfo.version,
    source: process.env.HULLDX_APP_SOURCE || packageInfo.name,
    readme: process.env.HULLDX_APP_DOCS || "readme.md",
    logo: process.env.HULLDX_APP_LOGO || "logo.png",
    picture: process.env.HULLDX_APP_PICTURE || "picture.png",
    ui: process.env.HULLDX_APP_UI === "true" || false,
    settings: [],
    private_settings: definePrivateSettings(),
    schedules: defineSchedules(),
    subscriptions: defineSubscriptions(),
    settings_sections: [] as HullConnectorSettingsSection[],
    json: [] as any[],
  };

  composedManifest.json = defineJsonSettings(composedManifest);
  composedManifest.settings_sections = defineSettingSections(composedManifest);

  res.json(composedManifest);
};
