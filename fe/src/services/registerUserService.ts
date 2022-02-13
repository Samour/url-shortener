import {RegisterUserRequest, RegisterUserResponse} from 'src/dto/RegisterUserDtos';
import {ApiError, ApiErrorCode} from 'src/errors/ApiError';
import {UserRegistrationError} from 'src/errors/UserRegistrationError';
import {HttpService, useHttpService} from './httpService';

export interface RegisterUserDetails {
  username: string;
  password: string;
}

export interface UserCreatedResult {
  userId: string;
  username: string;
}

export interface RegisterUserService {
  registerUser(userDetails: RegisterUserDetails): Promise<UserCreatedResult>;
}

class RegisterUserServiceImpl implements RegisterUserService {

  constructor(private readonly httpService: HttpService) {
  }

  async registerUser(userDetails: RegisterUserDetails): Promise<UserCreatedResult> {
    try {
      return await this.httpService.post<RegisterUserRequest, RegisterUserResponse>(
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
  }
}

let service: RegisterUserService | null = null;

export const useRegisterUserService = (): RegisterUserService => {
  const httpService = useHttpService();
  if (service === null) {
    service = new RegisterUserServiceImpl(httpService);
  }

  return service;
};
