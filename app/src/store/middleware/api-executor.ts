import axios, { AxiosRequestConfig } from 'axios';
import { Dispatch, Action } from 'redux';
import { ValidationErrors } from 'validatorjs';
// import Paginate from '../modules/common/paginate';

interface ApiExecutable extends AxiosRequestConfig {
  type: string;
}

export interface IApiResponse<T = any> extends Action {
  status: number;
  data: T;
  headers?: object;
  // paginate?: Paginate;
  error?: IApiError;
}

interface IApiError {
  message: string;
  status?: number;
  cause?: string;
  validationErrors?: {
    errors: ValidationErrors;
  };
}

const ApiStart = () => ({
  type: 'API/START'
});

const ApiResponseSuccess = <T = any>(
  type: string,
  result: ApiResponse
): IApiResponse => ({
  type: type,
  status: result.status,
  data: result.data as T,
  headers: result.headers
});

const ApiResponseFailed = <T = any>(
  type: string,
  result: ApiResponse
): IApiResponse => ({
  type: type,
  status: result.status,
  data: result.data,
  error: result.error
});

export class ApiResponse<T = any> implements IApiResponse<T> {
  type: string;
  status: number;
  data: T;
  // paginate?: Paginate;
  headers: object;
  error: IApiError;

  static fromResponse<U = any>(response: any) {
    const r = new this<U>();

    r.status = response.status;
    r.data = response.data.data;
    // r.paginate = response.data.data.paginate;
    r.headers = response.headers;

    return r;
  }

  static fromError<U = any>(error: any) {
    const r = new this<U>();

    r.status = error.status;
    r.error = new ApiError({
      message: error.data.message,
      cause: error.data.error,
      status: error.status
    });
    if (error.data.validation_errors) {
      r.error.validationErrors = error.data.validation_errors;
    }

    if (!r.isOK() && !r.error.message) {
      // TODO: エラーメッセージがサーバーから返らなかった場合の処理。取り急ぎalert出してる
      const errorMessage = [
        'エラーが発生しました:',
        error.statusText,
        `ステータス: ${r.status}`
      ].join('\n');

      alert(errorMessage);
    }

    return r;
  }

  isOK() {
    return this.status >= 200 && this.status < 400;
  }
}

class ResponseError implements Error {
  public name: string = 'ResponseError';
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class ApiError implements Error {
  public name: string = 'ApiError';
  public message: string;
  public validationErrors: { errors: ValidationErrors };
  public cause: string;
  public status: number;

  constructor(error: IApiError) {
    if (error.message) {
      this.message = error.message;
    }

    if (error.status) {
      this.status = error.status;
    }

    if (error.cause) {
      this.cause = error.cause;
    }

    if (error.validationErrors) {
      this.validationErrors = error.validationErrors;
    }
  }
}

export const ApiExecutor = <T = any>(config: ApiExecutable) => async (
  dispatch: Dispatch<Action>
) => {
  const success = `${config.type}/SUCCESS`;
  const failed = `${config.type}/FAILED`;

  dispatch(ApiStart());
  try {
    const json = await axios({
      url: `${baseUri()}${config.url}`,
      method: config.method,
      data: config.data,
      headers: config.headers
    }).catch(error => {
      throw error;
    });
    const result = ApiResponse.fromResponse<T>(json);
    dispatch(ApiResponseSuccess<T>(success, result));
  } catch (error) {
    if (!error.response) {
      throw new ResponseError(error);
    }
    const result = ApiResponse.fromError<T>(error);
    dispatch(ApiResponseFailed(failed, result));
  }
};

export const baseUri = () => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/v1'
    : 'https://airfes.jp/api/v1';
};

export const authorization = () => {
  return {
    'Content-Type': 'application/json',
    'access-token': localStorage.access_token,
    client: localStorage.client,
    uid: localStorage.uid
  };
};
