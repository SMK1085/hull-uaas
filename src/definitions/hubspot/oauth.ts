export interface HubspotAccessTokenInfoResponse {
  token: string;
  user: string;
  hub_domain: string;
  scopes: string[];
  hub_id: number;
  app_id: number;
  expires_in: number;
  user_id: number;
  token_type: string;
}
