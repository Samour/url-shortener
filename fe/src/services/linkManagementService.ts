import {Dispatch} from 'redux';
import {useDispatch} from 'react-redux';
import {LinksResponse} from 'src/dto/LinksResponse';
import {setLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {LinkFilterStatus} from 'src/store/model/LinkDetails';
import {GetParams, HttpService, useHttpService} from './httpService';

export interface LinkManagementService {
  fetchLinks(filter: LinkFilterStatus): Promise<void>;
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
