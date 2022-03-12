import {useDispatch} from 'react-redux';
import {LinkResponse, LinksResponse} from 'src/dto/LinksResponse';
import {setLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {LinkFilterStatus, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {linkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';
import {storeLinkDetailMutation} from 'src/store/mutations/linkDetails/StoreLinkDetailMutation';
import {GetParams, useHttpService} from './httpService';

export type FetchLinksFn = (filter: LinkFilterStatus) => Promise<void>;
export type FetchLinkByIdFn = (linkId: string) => Promise<void>;

export const useFetchLinks = (): FetchLinksFn => {
  const httpService = useHttpService();
  const dispatch = useDispatch();

  return async (filter: LinkFilterStatus): Promise<void> => {
    const params: GetParams = {};
    if (filter !== LinkFilterStatus.ALL) {
      params['status'] = filter;
    }
    const {links} = await httpService.get<LinksResponse>('/v1/links', params);
    dispatch(setLinksMutation(links));
  };
};

export const useFetchLinkById = (): FetchLinkByIdFn => {
  const httpService = useHttpService();
  const dispatch = useDispatch();

  return async (linkId: string): Promise<void> => {
    try {
      const linkDetail = await httpService.get<LinkResponse>(`/v1/links/${linkId}`);
      dispatch(storeLinkDetailMutation(linkDetail));
    } catch (e) {
      dispatch(linkInViewDataStatusMutation(LinkInViewDataStatus.UNAVAILABLE));
    }
  };
};
