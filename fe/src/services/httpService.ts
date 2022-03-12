import {Store} from 'redux';
import {useStore} from 'react-redux';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {HttpError} from 'src/errors/HttpError';
import {AppState} from 'src/store/model';
import {AppConfigs} from 'src/store/model/AppConfigs';
import {appConfigsMutation} from 'src/store/mutations/AppConfigsMutation';
import {userAnonymousMutation} from 'src/store/mutations/authenticatedUser/UserAnonymousMutation';

export type GetParams = { [key: string]: string };

export interface HttpService {
  get<T>(endpoint: string, params?: GetParams): Promise<T>;

  post<B, T>(endpoint: string, body: B): Promise<T>;

  patch<B, T>(endpoint: string, body: B): Promise<T>;
}

const isOkStatus = (statusCode: number): boolean => Math.floor(statusCode / 100) === 2;

class HttpServiceImpl implements HttpService {

  private baseUrl: Promise<string> | null = null;

  constructor(private readonly store: Store<AppState>) {
  }

  private async buildUrl(endpoint: string, params?: GetParams): Promise<string> {
    if (this.baseUrl === null) {
      this.baseUrl = fetch('/config.json')
        .then((r) => r.json())
        .then((config: AppConfigs) => {
          this.store.dispatch(appConfigsMutation(config));
          return config.apiEndpoint;
        });
    }
    const baseUrl = await this.baseUrl;
    const url = new URL(`${baseUrl}/${endpoint}`);
    url.pathname = url.pathname.replaceAll(/\/\/+/g, "/");
    if (params) {
      for (let key in params) {
        if (!!params[key]) {
          url.searchParams.set(key, params[key]);
        }
      }
    }
    return url.toString();
  }

  async get<T>(endpoint: string, params?: GetParams): Promise<T> {
    const url = await this.buildUrl(endpoint, params);
    return this.executeCall(() => fetch(
      url,
      {credentials: 'include'},
    ));
  }

  async post<B, T>(endpoint: string, body: B): Promise<T> {
    return this.makeCallWithBody('POST', endpoint, body);
  }

  async patch<B, T>(endpoint: string, body: B): Promise<T> {
    return this.makeCallWithBody('PATCH', endpoint, body);
  }

  private async makeCallWithBody<B, T>(method: string, endpoint: string, body: B): Promise<T> {
    const url = await this.buildUrl(endpoint);
    return this.executeCall(() =>
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      })
    )
  }

  private async executeCall<T>(execute: () => Promise<Response>): Promise<T> {
    const result = await execute();
    if (isOkStatus(result.status)) {
      return result.json();
    }

    try {
      const body = await result.json();
      if (typeof body.errorType === 'string' && typeof body.errorCode === 'string') {
        const apiError = new ApiError(result.status, body.errorType, body.errorCode);
        if (apiError.errorCode === ApiErrorCode.BAD_SESSION_ID) {
          this.store.dispatch(userAnonymousMutation());
        }
        return Promise.reject(apiError);
      } else {
        return Promise.reject(new HttpError(result.status));
      }
    } catch (e) {
      console.error('Unhandled exception in HttpServiceImpl', e);
      throw new HttpError(result.status);
    }
  }
}

let service: HttpService | null = null;

export const useHttpService = (): HttpService => {
  const store = useStore();
  if (service === null) {
    service = new HttpServiceImpl(store);
  }

  return service;
};
