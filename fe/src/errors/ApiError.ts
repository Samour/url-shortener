export enum ApiErrorCode {
  BAD_SESSION_ID = 'bad_session_id',
}

export class ApiError {
  constructor(
    public readonly statusCode: number,
    public readonly errorType: string,
    public readonly errorCode: string,
  ) {
  }
}
