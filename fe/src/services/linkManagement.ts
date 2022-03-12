import {useDispatch, useStore} from 'react-redux';
import {LinkResponse, LinksResponse, LinkStatus} from 'src/dto/LinksResponse';
import {LinkFilterStatus, LinkInViewDataStatus} from 'src/store/model/LinkDetails';
import {AppState} from 'src/store/model';
import {setLinksMutation} from 'src/store/mutations/linkDetails/SetLinksMutation';
import {linkInViewDataStatusMutation} from 'src/store/mutations/linkDetails/LinkInViewDataStatusMutation';
import {storeLinkDetailMutation} from 'src/store/mutations/linkDetails/StoreLinkDetailMutation';
import {IllegalStateException} from 'src/errors/IllegalStateException';
import {UpdateLinkRequest} from 'src/dto/UpdateLinkRequest';
import {GetParams, useHttpService} from './httpService';
import {CreateLinkRequest} from '../dto/CreateLinkRequest';

export interface UpdateLinkSpec {
  label: string;
  status: LinkStatus;
}

export interface CreateLinkSpec {
  label: string;
  status: LinkStatus;
  linkTarget: string;
}

export type FetchLinksFn = (filter: LinkFilterStatus) => Promise<void>;
export type FetchLinkByIdFn = (linkId: string) => Promise<void>;
export type UpdateLinkFn = (update: UpdateLinkSpec) => Promise<void>;
export type CreateLinkFn = (link: CreateLinkSpec) => Promise<string>;

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

export const useUpdateLink = (): UpdateLinkFn => {
  const store = useStore<AppState>();
  const httpService = useHttpService();

  return async (update: UpdateLinkSpec): Promise<void> => {
    const linkId = store.getState().linkDetails.linkInViewId;
    if (!linkId || store.getState().linkDetails.linkInViewDataStatus !== LinkInViewDataStatus.AVAILABLE) {
      throw new IllegalStateException();
    }

    const link = store.getState().linkDetails.links.find(({id}) => id === linkId)!;
    const request: UpdateLinkRequest = {
      label: update.label === link.label ? undefined : update.label,
      status: update.status === link.status ? undefined : update.status,
    };

    await httpService.patch(`/v1/links/${linkId}`, request);
  };
};

export const useCreateLink = (): CreateLinkFn => {
  const httpService = useHttpService();

  return async (link: CreateLinkSpec): Promise<string> => {
    const response = await httpService.post<CreateLinkRequest, LinkResponse>('/v1/links', link);
    return response.id;
  };
};
