import { uaasV1 } from "../../src/definitions/uaas/v1";

export const DEFAULT_SETTINGS: uaasV1.Schema$AppSettings = {
  account_mappings_lastchange: [],
  account_mappings_priority: [],
  account_mappings_quorum: [],
  user_mappings_lastchange: [],
  user_mappings_priority: [],
  user_mappings_quorum: [],
  user_freemail_enabled: false,
  user_freemail_attribute: "email",
  user_freemail_blacklist: [],
};
