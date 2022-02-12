import {AuthenticatedUserState} from './AuthenticatedUser';
import {AppConfigs} from './AppConfigs';

export interface AppState {
  authenticatedUser: AuthenticatedUserState;
  appConfigs: AppConfigs | null;
}
