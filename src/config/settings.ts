import {
  HullConnectorSettingsSection,
  HullConnectorSetting,
} from "../definitions/hull/hull-connector";

export const privateSettings: HullConnectorSetting[] = [
  {
    name: "account_mappings_quorum",
    type: "array",
    title: "Unified Attributes defined by Quorum",
    description: "The attributes to define by using the quorum strategy.",
    format: "table",
    items: {
      type: "object",
      properties: {
        name: {
          title: "Unified Attribute Name",
          type: "string",
          format: "accountTrait",
          options: {
            allowCreate: true,
            source: "unified",
          },
        },
        sources: {
          title: "Source Attributes",
          type: "array",
          format: "accountTrait",
          options: {
            uniqueItems: true,
          },
        },
      },
    },
  },
  {
    // url: /meta/methods/normalization
    name: "account_normalizations",
    type: "array",
    title: "Attribute Value Normalizations",
    description: "The attributes to normalize before applying unification",
    format: "table",
    items: {
      type: "object",
      properties: {
        method: {
          title: "Method",
          type: "string",
          format: "select",
          options: {
            allowCreate: false,
            loadOptions: "/meta/methods/normalization",
            placeholder: "Normalization Method",
          },
        },
        sources: {
          title: "Source Attributes",
          type: "array",
          format: "accountTrait",
          options: {
            uniqueItems: true,
          },
        },
      },
    },
  },
];

export const settingsSections: HullConnectorSettingsSection[] = [
  {
    title: "Account Unification",
    description: "Define how data on the account level gets unified.",
    properties: [
      "private_settings.account_mappings_quorum",
      "private_settings.account_normalizations",
    ],
  },
];

export const jsonSettings: any[] = [];
