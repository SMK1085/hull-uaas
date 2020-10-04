export interface OAuthAuthorizationCodeRequestInfo {
  grant_type: "authorization_code";
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  code: string;
}

export interface OAuthAuthorizationCodeResponseInfo {
  refresh_token?: string;
  access_token: string;
  expires_in?: number;
}
