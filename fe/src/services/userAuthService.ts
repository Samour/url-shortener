import {Store} from 'redux';
import {useStore} from 'react-redux';
import {AuthInfoResponse} from 'src/dto/AuthInfoResponse';
import {AppState} from 'src/store/model';
import {userAuthenticatedMutation} from 'src/store/mutations/authenticatedUser/UserAuthenticatedMutation';
import {userAnonymousMutation} from 'src/store/mutations/authenticatedUser/UserAnonymousMutation';
import {HttpService, useHttpService} from './httpService';

export interface UserAuthService {
  initialiseUserState(): void;
}

class UserAuthServiceImpl implements UserAuthService {

  constructor(private readonly httpService: HttpService, private readonly store: Store<AppState>) {
  }

  initialiseUserState(): void {
    this.httpService.get<AuthInfoResponse>('/v1/identity/info')
      .then((r) => this.store.dispatch(userAuthenticatedMutation(r)))
      .catch((e) => this.store.dispatch(userAnonymousMutation()));
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
