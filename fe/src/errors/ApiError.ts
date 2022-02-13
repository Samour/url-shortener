export enum ApiErrorCode {
  BAD_SESSION_ID = 'bad_session_id',
  USERNAME_NOT_AVAILABLE = 'username_not_available',
}

export class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly errorType: string,
    public readonly errorCode: string,
  ) {
  }
}
