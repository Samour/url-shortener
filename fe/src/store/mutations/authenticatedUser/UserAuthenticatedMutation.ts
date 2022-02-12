import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {UserDetails} from 'src/store/model/AuthenticatedUser';

export interface UserAuthenticatedMutation extends IMutation {
  type: MutationType.USER_AUTHENTICATED;
  userDetails: UserDetails;
}

export const userAuthenticatedMutation = (userDetails: UserDetails): UserAuthenticatedMutation => ({
  type: MutationType.USER_AUTHENTICATED,
  userDetails,
});
