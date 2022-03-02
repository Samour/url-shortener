import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';

export interface BringLinkIntoViewMutation extends IMutation {
  type: MutationType.BRING_LINK_INTO_VIEW;
  linkInViewId: string;
}

export const bringLinkIntoViewMutation = (linkInViewId: string): BringLinkIntoViewMutation => ({
  type: MutationType.BRING_LINK_INTO_VIEW,
  linkInViewId,
});
