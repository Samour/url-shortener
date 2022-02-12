import {createStore, Store} from 'redux';
import reducer from './reducers';
import {AppState} from './model';

export const store: Store<AppState> = createStore(reducer);
