import {Dispatch} from 'redux';
import {useDispatch} from 'react-redux';
import {HttpService, useHttpService} from './httpService';
import {LinksResponse} from 'src/dto/LinksResponse';
import {setLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';

export interface LinkManagementService {
  fetchLinks(): Promise<void>;
}

class LinkManagementServiceImpl implements LinkManagementService {

  constructor(private readonly httpService: HttpService, private readonly dispatch: Dispatch) {
  }

  async fetchLinks(): Promise<void> {
    const {links} = await this.httpService.get<LinksResponse>('/v1/links');
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
