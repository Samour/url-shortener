import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';

export interface UserAnonymousMutation extends IMutation{
  type: MutationType.USER_ANONYMOUS;
}

export const userAnonymousMutation = (): UserAnonymousMutation => ({
  type: MutationType.USER_ANONYMOUS,
});
