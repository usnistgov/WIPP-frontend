export class Tag {
  id: string;
  tagName: string;
  _links: any;
}

export interface PaginatedTags {
  page: any;
  tags: Tag[];
  _links: any;
}
