import {combineReducers} from 'redux';
import {AppState} from 'src/store/model';
import authenticatedUser from './authenticatedUser';
import appConfigs from './appConfigs';

export default combineReducers<AppState>({
  authenticatedUser,
  appConfigs,
});
