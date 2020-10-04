export interface HullConnectorAuth {
  id: string;
  secret: string;
  organization: string;
}

export interface HullConnectorManifest {
  name: string;
  description: string;
  picture?: string | null;
  version: string;
  tags?: string[] | null;
  settings?: HullConnectorSetting[] | null;
  private_settings?: HullConnectorSetting[] | null;
  settings_sections?: HullConnectorSettingsSection[] | null;
  resources?: any[] | null;
  readme?: string;
  subscriptions?: HullConnectorSubscription[] | null;
  schedules?: HullConnectorSchedule[] | null;
  json?: any | null;
  [key: string]: any | null;
}

export interface HullConnectorSetting {
  name: string;
  title?: string | null;
  description?: string | null;
  type: string;
  format?: string | null;
  enum?: string[] | null;
  default?: any | null;
  [key: string]: any | null;
}

export interface HullConnectorSettingsSection {
  title: string;
  description?: string | null;
  properties: string[];
}

export interface HullConnectorSubscription {
  url: string;
  [key: string]: any | null;
}

export interface HullConnectorSchedule {
  url: string;
  type: string;
  value: string;
}

export interface HullIncomingIdentityMapping {
  service: string;
  hull: string;
  required?: boolean;
}

export interface HullAttributeMapping {
  service: string;
  hull: string;
  readOnly?: boolean;
  overwrite?: boolean;
}

export interface HullConnectorFlowControlResponse {
  errors: string[];
  flow_control: {
    in: number;
    size: number;
    type: "next" | "retry";
    in_time?: number;
  };
  metrics: any[];
}
