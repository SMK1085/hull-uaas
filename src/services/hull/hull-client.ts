import { HullConnectorAuth } from "../../definitions/hull/hull-connector";
import { HullBatchPayload } from "../../definitions/hull/hull-api";
import { ApiResultObject, ApiMethod } from "../../definitions/generic/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ApiUtil } from "../../utils/api-util";
import {
  HullIdentImportAccount,
  HullIdentImportUser,
} from "../../definitions/hull/hull-objects";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

export class HullClient {
  readonly connectorAuth: HullConnectorAuth;

  constructor(auth: HullConnectorAuth) {
    this.connectorAuth = auth;
  }

  public async sendToFirehose(
    payload: HullBatchPayload,
  ): Promise<ApiResultObject<HullBatchPayload, any, AxiosError>> {
    const url = `https://firehose.hullapp.io`;
    const method: ApiMethod = "post";
    const axiosConfig = this.getAxiosConfig();
    axiosConfig.headers["Hull-Organization"] = this.connectorAuth.organization;

    try {
      const response = await axios.post<any>(url, payload, axiosConfig);
      return ApiUtil.handleApiResultSuccess(url, method, payload, response);
    } catch (error) {
      return ApiUtil.handleApiResultError(url, method, payload, error);
    }
  }

  public async retrieveConfiguration(): Promise<
    ApiResultObject<undefined, any, AxiosError>
  > {
    const url = `https://${this.connectorAuth.organization}/api/v1/${this.connectorAuth.id}`;
    const method: ApiMethod = "get";
    const axiosConfig = this.getAxiosConfig();

    try {
      const response = await axios.get<any>(url, axiosConfig);
      return ApiUtil.handleApiResultSuccess(url, method, undefined, response);
    } catch (error) {
      return ApiUtil.handleApiResultError(url, method, undefined, error);
    }
  }

  public async updateConfiguration(
    payload: any,
  ): Promise<ApiResultObject<any, any, AxiosError>> {
    const url = `https://${this.connectorAuth.organization}/api/v1/${this.connectorAuth.id}`;
    const method: ApiMethod = "put";
    const axiosConfig = this.getAxiosConfig();

    try {
      const response = await axios.put<any>(url, payload, axiosConfig);
      return ApiUtil.handleApiResultSuccess(url, method, payload, response);
    } catch (error) {
      return ApiUtil.handleApiResultError(url, method, payload, error);
    }
  }

  public async updateStatus(payload: {
    status: string;
    messages: string[];
  }): Promise<
    ApiResultObject<{ status: string; messages: string[] }, any, AxiosError>
  > {
    const url = `https://${this.connectorAuth.organization}/api/v1/${this.connectorAuth.id}/status`;
    const method: ApiMethod = "put";
    const axiosConfig = this.getAxiosConfig();

    try {
      const response = await axios.put<any>(url, payload, axiosConfig);
      return ApiUtil.handleApiResultSuccess(url, method, payload, response);
    } catch (error) {
      return ApiUtil.handleApiResultError(url, method, payload, error);
    }
  }

  public static createJwtAccount(
    connectorAuth: HullConnectorAuth,
    ident: HullIdentImportAccount,
  ): string {
    const claims = {
      // iss: connectorAuth.id,
      iat: Math.round(DateTime.utc().minus({ minutes: 1 }).toSeconds()),
      "io.hull.subjectType": "account",
      // exp: DateTime.utc().plus({ hours: 2 }).valueOf(),
      "io.hull.asAccount": { ...ident },
    };

    if (ident.external_id) {
      claims["io.hull.asAccount"] = {
        ...ident,
        external_id: `${ident.external_id}`,
      };
    }

    return jwt.sign(claims, connectorAuth.secret, {
      issuer: connectorAuth.id,
      expiresIn: "2h",
    });
  }

  public static createJwtUser(
    connectorAuth: HullConnectorAuth,
    ident: HullIdentImportUser,
  ): string {
    const claims = {
      // iss: connectorAuth.id,
      iat: Math.round(DateTime.utc().minus({ minutes: 1 }).toSeconds()),
      "io.hull.subjectType": "user",
      // exp: DateTime.utc().plus({ hours: 2 }).valueOf(),
      "io.hull.asUser": { ...ident },
    };

    return jwt.sign(claims, connectorAuth.secret, {
      issuer: connectorAuth.id,
      expiresIn: "2h",
    });
  }

  private getAxiosConfig(): AxiosRequestConfig {
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        "Hull-App-Id": this.connectorAuth.id,
        "Hull-Access-Token": this.connectorAuth.secret,
      },
      responseType: "json",
    };

    return axiosConfig;
  }
}
