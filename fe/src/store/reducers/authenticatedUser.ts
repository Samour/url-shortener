import {AuthenticatedUserState, AuthStatus} from 'src/store/model/AuthenticatedUser';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {UserAuthenticatedMutation} from 'src/store/mutations/authenticatedUser/UserAuthenticatedMutation';

const initialState: AuthenticatedUserState = {
  authStatus: AuthStatus.INDETERMINATE,
  userDetails: null,
};

const reducer = (state: AuthenticatedUserState | undefined, mutation: IMutation): AuthenticatedUserState => {
  if (mutation.type === MutationType.USER_AUTHENTICATED) {
    const {userDetails} = mutation as UserAuthenticatedMutation;
    return {
      authStatus: AuthStatus.AUTHENTICATED,
      userDetails,
    };
  } else if (mutation.type === MutationType.USER_ANONYMOUS) {
    return {
      authStatus: AuthStatus.UNAUTHENTICATED,
      userDetails: null,
    };
  } else {
    return state ?? initialState;
  }
};

export default reducer;
