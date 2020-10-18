import { Logger } from "winston";
import { ClientOpts } from "redis";
import { ConnectorRedisClient } from "../../utils/redis-client";
import { HullConnectorAuth } from "../hull/hull-connector";
import { HullClient } from "../../services/hull/hull-client";
import { Schema$HullKrakenCheckpoints } from "../hull/hull-api";
import {
  Schema$HullAttributesUser,
  Schema$HullAttributesAccount,
} from "../hull/hull-objects";

export type Schema$UnificationStrategyType =
  | "PRIORITY"
  | "LAST_CHANGE"
  | "QUORUM";

export namespace uaasV1 {
  export interface Options {
    version: "v1";
  }

  export interface DependencyInjectionOptions {
    logLevel: string;
    logMetaService: string;
    logMetaRuntimeVersion: string;
    logger: Logger;
    redisClientOpts: ClientOpts;
    redisClient: ConnectorRedisClient;
    correlationKey?: string;
    hullAppId?: string;
    hullAppSecret?: string;
    hullAppOrganization?: string;
    hullAppAuth?: HullConnectorAuth;
    hullClient?: HullClient;
    hullAppSettings?: Schema$AppSettings;
    hullKrakenNotificationId?: string;
    hullKrakenCheckpoints?: Schema$HullKrakenCheckpoints;
    hullKrakenUpdateIds?: string[];
  }

  export interface Schema$AppSettings {
    user_mappings_quorum: Schema$UnificationMappingBase[];
    user_normalizations?: Schema$NormalizationDefinition[];
    account_mappings_priority: Schema$UnificationMappingBase[];
    account_mappings_lastchange: Schema$UnificationMappingBase[];
    account_mappings_quorum: Schema$UnificationMappingBase[];
    account_normalizations?: Schema$NormalizationDefinition[];
  }

  export interface Schema$UnificationMappingBase {
    name: string;
    sources: string[];
    normalization_method?: string | null;
  }

  export interface Schema$UnificationMapping
    extends Schema$UnificationMappingBase {
    strategy: Schema$UnificationStrategyType;
  }

  export interface Schema$NormalizationDefinition {
    method: string;
    sources: string[];
  }

  export interface Resource$StrategyHandler {
    handleUser(user: Schema$HullAttributesUser): Schema$HullAttributesUser;
    handleAccount(
      account: Schema$HullAttributesAccount,
    ): Schema$HullAttributesAccount;
  }
}
