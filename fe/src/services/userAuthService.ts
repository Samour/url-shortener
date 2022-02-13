import {Store} from 'redux';
import {useStore} from 'react-redux';
import {AuthInfoResponse} from 'src/dto/AuthInfoResponse';
import {AppState} from 'src/store/model';
import {userAuthenticatedMutation} from 'src/store/mutations/authenticatedUser/UserAuthenticatedMutation';
import {userAnonymousMutation} from 'src/store/mutations/authenticatedUser/UserAnonymousMutation';
import {LoginRequest, LoginResponse} from 'src/dto/LoginDtos';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {UserLoginError} from 'src/errors/UserLoginError';
import {HttpService, useHttpService} from './httpService';

export interface UserAuthService {
  initialiseUserState(): Promise<void>;

  logIn(username: string, password: string): Promise<void>;
}

class UserAuthServiceImpl implements UserAuthService {

  constructor(private readonly httpService: HttpService, private readonly store: Store<AppState>) {
  }

  async initialiseUserState(): Promise<void> {
    try {
      const result = await this.httpService.get<AuthInfoResponse>('/v1/identity/info');
      this.store.dispatch(userAuthenticatedMutation(result));
    } catch (e) {
      this.store.dispatch(userAnonymousMutation());
    }
  }

  async logIn(username: string, password: string): Promise<void> {
    try {
      const result = await this.httpService.post<LoginRequest, LoginResponse>(
        '/v1/identity/login',
        {username, password},
      );
      this.store.dispatch(userAuthenticatedMutation(result));
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === ApiErrorCode.LOGIN_FAILURE) {
        throw new UserLoginError();
      } else {
        throw e;
      }
    }
  }
}

let service: UserAuthService | null = null;

export const useUserAuthService = (): UserAuthService => {
  const httpService = useHttpService();
  const store = useStore();
  if (service === null) {
    service = new UserAuthServiceImpl(httpService, store);
  }

  return service;
};
