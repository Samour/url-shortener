import {AuthenticatedUserState} from './AuthenticatedUser';
import {AppConfigs} from './AppConfigs';
import {LinkDetailsState} from './LinkDetails';

export interface AppState {
  authenticatedUser: AuthenticatedUserState;
  linkDetails: LinkDetailsState;
  appConfigs: AppConfigs | null;
}
