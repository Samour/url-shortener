import {LinkDetail} from 'src/store/model/LinkDetails';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';

export interface StoreLinkDetailMutation extends IMutation {
  type: MutationType.STORE_LINK_DETAIL;
  linkDetail: LinkDetail;
}

export const storeLinkDetailMutation = (linkDetail: LinkDetail): StoreLinkDetailMutation => ({
  type: MutationType.STORE_LINK_DETAIL,
  linkDetail,
});
