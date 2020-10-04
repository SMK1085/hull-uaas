import { Method, AxiosResponse, AxiosError } from "axios";
import { ApiResultObject } from "../definitions/generic/api";

export class ApiUtil {
  /**
   * Handles errors of an API operation and creates an appropriate result.
   *
   * @static
   * @template T The type of data.
   * @param {string} url The url of the API endpoint
   * @param {Method} method The API method.
   * @param {TPayload} payload The payload data with which the API endpoint has been invoked.
   * @param {AxiosError} error The error thrown by the invocation of the API.
   * @returns {ApiResultObject<TPayload, TData, AxiosError>} An API result with the properly formatted error messages.
   * @memberof ErrorUtil
   */
  public static handleApiResultError<TPayload, TData>(
    url: string,
    method: Method,
    payload: TPayload,
    error: AxiosError,
  ): ApiResultObject<TPayload, TData, AxiosError> {
    const apiResult: ApiResultObject<TPayload, TData, AxiosError> = {
      data: undefined,
      endpoint: url,
      error: error.message,
      method,
      payload,
      success: false,
      errorDetails: error,
    };

    return apiResult;
  }

  /**
   * Creates a properly composed API result object based on the axios response.
   *
   * @static
   * @template T The type of data.
   * @param {string} url The url of the API endpoint.
   * @param {Method} method The API method.
   * @param {TPayload} payload The payload data with which the API endpoint has been invoked.
   * @param {AxiosResponse<TData>} axiosResponse The response returned from Axios.
   * @returns {ApiResultObject<TPayload, TData, AxiosError>} A properly composed API result object.
   * @memberof ApiUtil
   */
  public static handleApiResultSuccess<TPayload, TData>(
    url: string,
    method: Method,
    payload: TPayload,
    axiosResponse: AxiosResponse<TData>,
  ): ApiResultObject<TPayload, TData, AxiosError> {
    const apiResult: ApiResultObject<TPayload, TData, AxiosError> = {
      data: axiosResponse.data,
      endpoint: url,
      error: axiosResponse.status >= 400 ? axiosResponse.statusText : undefined,
      method,
      payload,
      success: axiosResponse.status < 400,
    };

    return apiResult;
  }
}
