import { PaginatedQueryBaseDto } from '@libs/api/paginated.querybase.dto';

export function parseMongooseQuery(query: PaginatedQueryBaseDto) {
  const {
    page = 1,
    limit = 10,
    field = 'createdAt',
    param = 'desc',
    ...filters
  } = query;
  const offset = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [field]: param === 'asc' ? 1 : -1 };
  const where: Record<string, any> = {};

  for (const key in filters) {
    if (filters[key] !== undefined) where[key] = filters[key];
  }

  return { page, limit, offset, sort, where };
}
