import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';
import {LinkInViewDataStatus} from 'src/store/model/LinkDetails';

export interface LinkInViewDataStatusMutation extends IMutation {
  type: MutationType.LINK_IN_VIEW_DATA_STATUS;
  linkInViewDataStatus: LinkInViewDataStatus;
}

export const linkInViewDataStatusMutation = (
  linkInViewDataStatus: LinkInViewDataStatus,
): LinkInViewDataStatusMutation => ({
  type: MutationType.LINK_IN_VIEW_DATA_STATUS,
  linkInViewDataStatus,
});
