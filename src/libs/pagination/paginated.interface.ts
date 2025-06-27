export type OrderBy = { field: string; param: 'asc' | 'desc' };

export type MongoosePaginateParams = {
  page: number;
  limit: number;
  offset: number;
  sort: Record<string, 1 | -1>;
  where: Record<string, any>;
};

export class Paginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: Paginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}
