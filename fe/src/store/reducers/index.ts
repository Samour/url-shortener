import {combineReducers} from 'redux';
import {AppState} from 'src/store/model';
import authenticatedUser from './authenticatedUser';
import linkDetails from './linkDetails';
import appConfigs from './appConfigs';

export default combineReducers<AppState>({
  authenticatedUser,
  linkDetails,
  appConfigs,
});
