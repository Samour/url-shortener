import {AuthenticatedUserState, AuthStatus} from 'src/store/model/AuthenticatedUser';
import {IMutation} from 'src/store/mutations/IMutation';

const initialState: AuthenticatedUserState = {
  authStatus: AuthStatus.INDETERMINATE,
  userDetails: null,
};

const reducer = (state: AuthenticatedUserState | undefined, mutation: IMutation): AuthenticatedUserState => {
  return state ?? initialState;
};

export default reducer;
