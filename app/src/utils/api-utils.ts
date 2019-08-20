import axios, { AxiosRequestConfig } from 'axios';
// import Paginate from '../store/modules/common/paginate';
import { ValidationErrors } from 'validatorjs';

type ApiConfig = AxiosRequestConfig;

export interface IApiResponse<T = any> {
  status: number;
  data: T;
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

export class ResponceError implements Error {
  public name: string = 'ResponceError';
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class ApiResponse<T = any> implements IApiResponse<T> {
  status: number;
  data: T;
  // paginate?: Paginate;
  error: ApiError;

  static fromResponse<U = any>(response: any) {
    const r = new this<U>();

    r.status = response.status;
    r.data = response.data;
    // r.paginate = response.data.result.paginate;

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

export class ApiUtils {
  static async get<U = any>(url: string, params?: any, config?: ApiConfig) {
    try {
      const response = await axios
        .get(url, {
          ...config,
          params
        })
        .catch(error => {
          throw error;
        });
      return ApiResponse.fromResponse<U>(response);
    } catch (error) {
      if (!error.response) {
        throw new ResponceError(error);
      }
      return ApiResponse.fromError<U>(error.response);
    }
  }

  static async post<U = any>(url: string, data: any, config?: ApiConfig) {
    try {
      const response = await axios
        .post(url, data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.csrfTokenContent()
          },
          ...config
        })
        .catch(error => {
          throw error;
        });
      console.log(response);
      return ApiResponse.fromResponse<U>(response);
    } catch (error) {
      console.log(error);
      if (!error.response) {
        throw new ResponceError(error);
      }
      return ApiResponse.fromError<U>(error.response);
    }
  }

  static async put<U = any>(
    url: string,
    data: any,
    config?: ApiConfig
  ): Promise<ApiResponse> {
    try {
      const response = await axios
        .put(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.csrfTokenContent()
          },
          ...config
        })
        .catch(error => {
          throw error;
        });
      return ApiResponse.fromResponse<U>(response);
    } catch (error) {
      if (!error.response) {
        throw new ResponceError(error);
      }
      return ApiResponse.fromError<U>(error.response);
    }
  }

  static async patch<U = any>(
    url: string,
    data: any,
    config?: ApiConfig
  ): Promise<ApiResponse> {
    try {
      const response = await axios
        .patch(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.csrfTokenContent()
          },
          ...config
        })
        .catch(error => {
          throw error;
        });
      return ApiResponse.fromResponse<U>(response);
    } catch (error) {
      if (!error.response) {
        throw new ResponceError(error);
      }
      return ApiResponse.fromError<U>(error.response);
    }
  }

  static async delete<U = any>(
    url: string,
    config?: ApiConfig
  ): Promise<ApiResponse> {
    try {
      const response = await axios
        .delete(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.csrfTokenContent()
          },
          ...config
        })
        .catch(error => {
          throw error;
        });
      return ApiResponse.fromResponse<U>(response);
    } catch (error) {
      if (!error.response) {
        throw new ResponceError(error);
      }
      return ApiResponse.fromError<U>(error.response);
    }
  }

  static csrfTokenContent(): string | null {
    const csrfToken: HTMLMetaElement = document.head.children.namedItem(
      'csrf-token'
    ) as HTMLMetaElement;

    return csrfToken ? csrfToken.content : null;
  }
}
