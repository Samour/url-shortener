export interface RegisterUserRequest {
  username: string;
  password: string;
}

export interface RegisterUserResponse {
  userId: string;
  username: string;
}
