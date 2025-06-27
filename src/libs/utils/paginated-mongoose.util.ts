import { Model } from 'mongoose';
import { Paginated } from '../pagination/paginated.interface';
import { parseMongooseQuery } from './parse-mongoose-query.util';

export async function paginateMongoose<T>(
  model: Model<T>,
  params: ReturnType<typeof parseMongooseQuery>,
): Promise<Paginated<T>> {
  const { page, limit, offset, sort, where } = params;

  const [count, data] = await Promise.all([
    model.countDocuments(where),
    model.find(where).sort(sort).skip(offset).limit(limit),
  ]);

  return new Paginated({ count, limit, page, data });
}
