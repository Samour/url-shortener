import {LinkDetailsState, LinkFilterStatus, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {SetLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {SetLinkFilterStatusMutation} from 'src/store/mutations/linkDetails/SetLinkFilterStatusMutation';
import {BringLinkIntoViewMutation} from 'src/store/mutations/linkDetails/BringLinkIntoViewMutation';
import {StoreLinkDetailMutation} from 'src/store/mutations/linkDetails/StoreLinkDetailMutation';
import {LinkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';

const initialState: LinkDetailsState = {
  filterStatus: LinkFilterStatus.ACTIVE,
  links: [],
  linkInViewId: null,
  linkInViewDataStatus: LinkInViewDataStatus.NOT_APPLICABLE,
};

const mutationReducer = (state: LinkDetailsState | undefined, mutation: IMutation): LinkDetailsState => {
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
  } else if (mutation.type === MutationType.BRING_LINK_INTO_VIEW) {
    const {linkInViewId} = mutation as BringLinkIntoViewMutation;
    return {
      ...state,
      linkInViewId,
    };
  } else if (mutation.type === MutationType.STORE_LINK_DETAIL) {
    const {linkDetail} = mutation as StoreLinkDetailMutation;
    return {
      ...state,
      links: [
        ...state.links.filter(({id}) => id !== linkDetail.id),
        linkDetail,
      ],
    };
  } else if (mutation.type === MutationType.LINK_IN_VIEW_DATA_STATUS) {
    const {linkInViewDataStatus} = mutation as LinkInViewDataStatusMutation;
    return {
      ...state,
      linkInViewDataStatus,
    };
  } else {
    return state;
  }
};

const computeLinkInViewDataState = (state: LinkDetailsState): LinkInViewDataStatus => {
  if (state.linkInViewId === null) {
    return LinkInViewDataStatus.NOT_APPLICABLE;
  } else if (state.links.find(({id}) => id === state.linkInViewId)) {
    return LinkInViewDataStatus.AVAILABLE;
  } else if (state.linkInViewDataStatus === LinkInViewDataStatus.PENDING) {
    return LinkInViewDataStatus.PENDING;
  } else {
    return LinkInViewDataStatus.UNAVAILABLE;
  }
};

const linkInViewDataStatusReducer = (state: LinkDetailsState | undefined, mutation: IMutation): LinkDetailsState => {
  const newState = mutationReducer(state, mutation);
  return {
    ...newState,
    linkInViewDataStatus: computeLinkInViewDataState(newState),
  };
};

export default linkInViewDataStatusReducer;
