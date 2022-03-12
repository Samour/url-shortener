import {LinkStatus} from './LinksResponse';

export interface CreateLinkRequest {
  label: string;
  status: LinkStatus;
  linkTarget: string;
}
