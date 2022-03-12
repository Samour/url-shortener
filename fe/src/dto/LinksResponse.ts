export enum LinkStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface LinkResponse {
  id: string;
  label: string;
  pathName: string;
  status: LinkStatus;
  linkTarget: string;
}

export interface LinksResponse {
  links: LinkResponse[];
}
