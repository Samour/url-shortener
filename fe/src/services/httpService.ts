import {Store} from 'redux';
import {useStore} from 'react-redux';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {HttpError} from 'src/errors/HttpError';
import {AppState} from 'src/store/model';
import {AppConfigs} from 'src/store/model/AppConfigs';
import {appConfigsMutation} from 'src/store/mutations/AppConfigsMutation';
import {userAnonymousMutation} from 'src/store/mutations/authenticatedUser/UserAnonymousMutation';

export interface HttpService {
  get<T>(endpoint: string): Promise<T>;

  post<B, T>(endpoint: string, body: B): Promise<T>;
}

const isOkStatus = (statusCode: number): boolean => Math.floor(statusCode / 100) === 2;

class HttpServiceImpl implements HttpService {

  private baseUrl: Promise<string> | null = null;

  constructor(private readonly store: Store<AppState>) {
  }

  private getBaseUrl(): Promise<string> {
    if (this.baseUrl === null) {
      this.baseUrl = fetch('/config.json')
        .then((r) => r.json())
        .then((config: AppConfigs) => {
          this.store.dispatch(appConfigsMutation(config));
          return config.apiEndpoint;
        });
    }
    return this.baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    return this.executeCall(() => fetch(
      `${baseUrl}${endpoint}`,
      {
        credentials: 'include',
      },
    ));
  }

  async post<B, T>(endpoint: string, body: B): Promise<T> {
    const baseUrl = await this.getBaseUrl();
    return this.executeCall(() =>
      fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
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
