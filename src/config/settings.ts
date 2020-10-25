import {
  HullConnectorSettingsSection,
  HullConnectorSetting,
} from "../definitions/hull/hull-connector";

export const privateSettings: HullConnectorSetting[] = [
  {
    name: "user_mappings_priority",
    type: "array",
    title: "Unified Attributes defined by Priority",
    description:
      'The attributes to define by using the priority or "fallback" strategy.',
    format: "table",
    items: {
      type: "object",
      properties: {
        name: {
          title: "Unified Attribute Name",
          type: "string",
          format: "trait",
          options: {
            allowCreate: true,
            source: "unified",
          },
        },
        sources: {
          title: "Source Attributes",
          type: "array",
          format: "trait",
          options: {
            uniqueItems: true,
          },
        },
        normalization_method: {
          title: "Normalization",
          type: "string",
          default: "NONE",
          format: "select",
          options: {
            allowCreate: false,
            loadOptions: "/meta/methods/normalization",
            placeholder: "Normalization Method",
          },
        },
      },
    },
  },
  {
    name: "user_mappings_quorum",
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
          format: "trait",
          options: {
            allowCreate: true,
            source: "unified",
          },
        },
        sources: {
          title: "Source Attributes",
          type: "array",
          format: "trait",
          options: {
            uniqueItems: true,
          },
        },
        normalization_method: {
          title: "Normalization",
          type: "string",
          default: "NONE",
          format: "select",
          options: {
            allowCreate: false,
            loadOptions: "/meta/methods/normalization",
            placeholder: "Normalization Method",
          },
        },
      },
    },
  },
  {
    name: "account_mappings_priority",
    type: "array",
    title: "Unified Attributes defined by Priority",
    description:
      'The attributes to define by using the priority or "fallback" strategy.',
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
        normalization_method: {
          title: "Normalization",
          type: "string",
          default: "NONE",
          format: "select",
          options: {
            allowCreate: false,
            loadOptions: "/meta/methods/normalization",
            placeholder: "Normalization Method",
          },
        },
      },
    },
  },
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
        normalization_method: {
          title: "Normalization",
          type: "string",
          default: "NONE",
          format: "select",
          options: {
            allowCreate: false,
            loadOptions: "/meta/methods/normalization",
            placeholder: "Normalization Method",
          },
        },
      },
    },
  },
];

export const settingsSections: HullConnectorSettingsSection[] = [
  {
    title: "User Unification",
    description: "Define how data on the user level gets unified.",
    properties: [
      "private_settings.user_mappings_priority",
      "private_settings.user_mappings_quorum",
    ],
  },
  {
    title: "Account Unification",
    description: "Define how data on the account level gets unified.",
    properties: [
      "private_settings.account_mappings_priority",
      "private_settings.account_mappings_quorum",
    ],
  },
];

export const jsonSettings: any[] = [];
