export enum AuthStatus {
  INDETERMINATE = 'INDETERMINATE',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED = 'AUTHENTICATED',
}

export interface UserDetails {
  userId: string;
  username: string;
}

export interface AuthenticatedUserState {
  authStatus: AuthStatus;
  userDetails: UserDetails | null;
}
