import { HullSegment } from "./hull-objects";
import { HullConnectorAuth } from "./hull-connector";

export type HullBatchOperationType = "track" | "traits" | "alias" | "unalias";

export interface HullBatchItem {
  type: HullBatchOperationType;
  timestamp: string;
  headers: {
    "Hull-Access-Token": string;
  };
  body: {
    [key: string]: any;
  };
}

export interface HullBatchPayload {
  timestamp: string;
  sentAt: string;
  batch: HullBatchItem[];
}

export interface SmartNotifierNotification {
  channel: string;
  is_export: boolean;
  segments: HullSegment[];
  account_segments: HullSegment[];
  notification_id: string;
  configuration: HullConnectorAuth;
  kraken: HullKrakenInfo;
}

export interface HullKrakenInfo {
  retries: number;
  checkpoints: Schema$HullKrakenCheckpoints;
  "flow-control": HullKrakenInfoFlowControl;
  "estimated-optimal-shipment-size": number;
  "update-ids": string[];
}

export interface Schema$HullKrakenCheckpoints {
  [key: string]: number;
}

export interface HullKrakenInfoFlowControl {
  "max-messages": number;
  warning: any | null;
  "min-delay": number;
  "max-delay": number;
  type: string;
}
