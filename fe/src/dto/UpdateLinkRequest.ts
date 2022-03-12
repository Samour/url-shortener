import {LinkStatus} from './LinksResponse';

export interface UpdateLinkRequest {
  label?: string;
  status?: LinkStatus;
}
