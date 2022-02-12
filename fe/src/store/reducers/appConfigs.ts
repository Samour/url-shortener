import {AppConfigs} from 'src/store/model/AppConfigs';
import {IMutation} from 'src/store/mutations/IMutation';

const initialState: AppConfigs | null = null;

const reducer = (state: AppConfigs | null | undefined, mutation: IMutation): AppConfigs | null => {
  return state ?? initialState;
};

export default reducer;
