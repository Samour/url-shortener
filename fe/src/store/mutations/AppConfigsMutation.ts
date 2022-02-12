import {AppConfigs} from 'src/store/model/AppConfigs';
import {IMutation} from './IMutation';
import {MutationType} from './MutationType';

export interface AppConfigsMutation extends IMutation {
  type: MutationType.APP_CONFIGS;
  appConfigs: AppConfigs;
}

export const appConfigsMutation = (appConfigs: AppConfigs): AppConfigsMutation => ({
  type: MutationType.APP_CONFIGS,
  appConfigs,
});
