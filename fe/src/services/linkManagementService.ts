import {Dispatch} from 'redux';
import {useDispatch} from 'react-redux';
import {LinkResponse, LinksResponse} from 'src/dto/LinksResponse';
import {setLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {LinkFilterStatus, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {linkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';
import {storeLinkDetailMutation} from 'src/store/mutations/linkDetails/StoreLinkDetailMutation';
import {GetParams, HttpService, useHttpService} from './httpService';

export interface LinkManagementService {
  fetchLinks(filter: LinkFilterStatus): Promise<void>;

  fetchLinkById(linkId: string): Promise<void>;
}

class LinkManagementServiceImpl implements LinkManagementService {

  constructor(private readonly httpService: HttpService, private readonly dispatch: Dispatch) {
  }

  async fetchLinks(filter: LinkFilterStatus): Promise<void> {
    const params: GetParams = {};
    if (filter !== LinkFilterStatus.ALL) {
      params['status'] = filter;
    }
    const {links} = await this.httpService.get<LinksResponse>('/v1/links', params);
    this.dispatch(setLinksMutation(links));
  }

  async fetchLinkById(linkId: string): Promise<void> {
    try {
      const linkDetail = await this.httpService.get<LinkResponse>(`/v1/links/${linkId}`);
      this.dispatch(storeLinkDetailMutation(linkDetail));
    } catch (e) {
      this.dispatch(linkInViewDataStatusMutation(LinkInViewDataStatus.UNAVAILABLE));
    }
  }
}

let service: LinkManagementService | null = null;

export const useLinkManagementService = (): LinkManagementService => {
  const httpService = useHttpService();
  const dispatch = useDispatch();
  if (service === null) {
    service = new LinkManagementServiceImpl(httpService, dispatch);
  }

  return service;
};
