import {LinkDetailsState, LinkFilterStatus} from 'src/store/model/LinkDetails';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {SetLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {SetLinkFilterStatusMutation} from 'src/store/mutations/linkDetails/SetLinkFilterStatusMutation';

const initialState: LinkDetailsState = {
  filterStatus: LinkFilterStatus.ACTIVE,
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
  } else if (mutation.type === MutationType.SET_LINK_FILTER_STATUS) {
    const {filterStatus} = mutation as SetLinkFilterStatusMutation;
    return {
      ...state,
      filterStatus,
    };
  } else {
    return state;
  }
};

export default reducer;
