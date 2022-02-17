export interface LinkResponse {
  id: string;
  label: string;
  pathName: string;
  status: string;
  linkTarget: string;
}

export interface LinksResponse {
  links: LinkResponse[];
}
