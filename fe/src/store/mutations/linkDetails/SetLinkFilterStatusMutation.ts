import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {LinkFilterStatus} from 'src/store/model/LinkDetails';

export interface SetLinkFilterStatusMutation extends IMutation {
  type: MutationType.SET_LINK_FILTER_STATUS;
  filterStatus: LinkFilterStatus;
}

export const setLinkFilterStatusMutation = (filterStatus: LinkFilterStatus): SetLinkFilterStatusMutation => ({
  type: MutationType.SET_LINK_FILTER_STATUS,
  filterStatus,
});
