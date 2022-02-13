import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthStatus} from 'src/store/model/AuthenticatedUser';
import {AppState} from 'src/store/model';

export enum AuthRequired {
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

interface Params {
  auth?: AuthRequired;
  navigateOnFailure?: string;
}

interface State {
  authStatus: AuthStatus;
}

const selector = (state: AppState): State => ({
  authStatus: state.authenticatedUser.authStatus,
});

const mayAccess = (authRequired: AuthRequired, authStatus: AuthStatus): boolean => {
  if (authRequired === AuthRequired.AUTHENTICATED) {
    return authStatus === AuthStatus.AUTHENTICATED;
  } else if (authRequired === AuthRequired.UNAUTHENTICATED) {
    return authStatus === AuthStatus.UNAUTHENTICATED;
  } else {
    return false;
  }
};

const authenticated = (params: Params = {}) => <P extends object>(Delegate: React.ComponentType<P>) =>
  (props: P): JSX.Element => {
    const {
      auth = AuthRequired.AUTHENTICATED,
      navigateOnFailure = '/login',
    } = params;

    const {authStatus} = useSelector(selector);
    const navigate = useNavigate();

    if (mayAccess(auth, authStatus)) {
      return <Delegate {...props}/>;
    } else {
      return <Navigate to={navigateOnFailure}/>
    }
  };

export default authenticated;
