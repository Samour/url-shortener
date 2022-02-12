import {Store} from 'redux';
import {versionConfig} from 'src/versionConfig';
import {AppState} from 'src/store/model';

export const registerAppInfo = (store: Store<AppState>) => {
  (window as any).debugAppInfo = () => {
    const {
      appConfigs,
      authenticatedUser,
    } = store.getState();
    console.log({
      version: versionConfig.version,
      appConfigs,
      authState: authenticatedUser,
    });
  };
};
