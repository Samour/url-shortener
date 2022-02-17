export interface LinkDetail {
  id: string;
  label: string;
  pathName: string;
  status: string;
  linkTarget: string;
}

export interface LinkDetailsState {
  links: LinkDetail[];
}
