import {RegisterUserRequest, RegisterUserResponse} from 'src/dto/RegisterUserDtos';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {UserRegistrationError} from 'src/errors/UserRegistrationError';
import {useHttpService} from './httpService';

export interface RegisterUserDetails {
  username: string;
  password: string;
}

export interface UserCreatedResult {
  userId: string;
  username: string;
}

export type RegisterUserFn = (userDetails: RegisterUserDetails) => Promise<UserCreatedResult>;

export const useRegisterUser = (): RegisterUserFn => {
  const httpService = useHttpService();

  return async (userDetails: RegisterUserDetails): Promise<UserCreatedResult> => {
    try {
      return await httpService.post<RegisterUserRequest, RegisterUserResponse>(
        '/v1/identity/register',
        userDetails,
      );
    } catch (e) {
      if (e instanceof ApiError && e.errorCode === ApiErrorCode.USERNAME_NOT_AVAILABLE) {
        throw new UserRegistrationError();
      } else {
        throw e;
      }
    }
  };
};
