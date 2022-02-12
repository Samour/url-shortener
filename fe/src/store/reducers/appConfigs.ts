import {AppConfigs} from 'src/store/model/AppConfigs';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {AppConfigsMutation} from 'src/store/mutations/AppConfigsMutation';

const initialState: AppConfigs | null = null;

const reducer = (state: AppConfigs | null | undefined, mutation: IMutation): AppConfigs | null => {
  if (mutation.type === MutationType.APP_CONFIGS) {
    const {appConfigs} = mutation as AppConfigsMutation;
    return appConfigs;
  } else {
    return state ?? initialState;
  }
};

export default reducer;
