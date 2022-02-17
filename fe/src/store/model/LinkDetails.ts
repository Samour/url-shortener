export interface LinkDetail {
  id: string;
  label: string;
  pathName: string;
  status: string;
  linkTarget: string;
}

export enum LinkFilterStatus {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface LinkDetailsState {
  filterStatus: LinkFilterStatus;
  links: LinkDetail[];
}
