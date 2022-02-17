import {LinkDetail} from 'src/store/model/LinkDetails';
import {IMutation} from 'src/store/mutations/IMutation';
import {MutationType} from 'src/store/mutations/MutationType';

export interface SetLinksMutation extends IMutation {
  type: MutationType.SET_LINKS;
  links: LinkDetail[];
}

export const setLinksMutation = (links: LinkDetail[]): SetLinksMutation => ({
  type: MutationType.SET_LINKS,
  links,
});
