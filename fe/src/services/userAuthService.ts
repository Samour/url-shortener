import {useDispatch} from 'react-redux';
import {AuthInfoResponse} from 'src/dto/AuthInfoResponse';
import {userAuthenticatedMutation} from 'src/store/mutations/authenticatedUser/UserAuthenticatedMutation';
import {userAnonymousMutation} from 'src/store/mutations/authenticatedUser/UserAnonymousMutation';
import {LoginRequest, LoginResponse} from 'src/dto/LoginDtos';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {UserLoginError} from 'src/errors/UserLoginError';
import {useHttpService} from './httpService';

export type InitialiseUserStateFn = () => Promise<void>;
export type LogInFn = (username: string, password: string) => Promise<void>;
export type LogOutFn = () => Promise<void>;

export const useInitialiseUserState = (): InitialiseUserStateFn => {
  const httpService = useHttpService();
  const dispatch = useDispatch();

  return async (): Promise<void> => {
    try {
      const result = await httpService.get<AuthInfoResponse>('/v1/identity/info');
      dispatch(userAuthenticatedMutation(result));
    } catch (e) {
      dispatch(userAnonymousMutation());
    }
  };
};

export const useLogIn = (): LogInFn => {
  const httpService = useHttpService();
  const dispatch = useDispatch();

  return async (username: string, password: string): Promise<void> => {
    try {
      const result = await httpService.post<LoginRequest, LoginResponse>(
        '/v1/identity/login',
        {username, password},
      );
      dispatch(userAuthenticatedMutation(result));
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === ApiErrorCode.LOGIN_FAILURE) {
        throw new UserLoginError();
      } else {
        throw e;
      }
    }
  };
};

export const useLogOut = (): LogOutFn => {
  const httpService = useHttpService();
  const dispatch = useDispatch();

  return async (): Promise<void> => {
    await httpService.post('/v1/identity/logout', {});
    dispatch(userAnonymousMutation());
  };
};
