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

export enum LinkInViewDataStatus {
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PENDING = 'PENDING',
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
}

export interface LinkDetailsState {
  filterStatus: LinkFilterStatus;
  links: LinkDetail[];
  linkInViewId: string | null;
  linkInViewDataStatus: LinkInViewDataStatus;
}
