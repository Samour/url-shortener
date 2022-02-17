import {LinkDetailsState} from 'src/store/model/LinkDetails';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {SetLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';

const initialState: LinkDetailsState = {
  links: [],
};

const reducer = (state: LinkDetailsState | undefined, mutation: IMutation): LinkDetailsState => {
  state = state ?? initialState;
  if (mutation.type === MutationType.SET_LINKS) {
    const {links} = mutation as SetLinksMutation;
    return {
      ...state,
      links,
    };
  } else {
    return state;
  }
};

export default reducer;
