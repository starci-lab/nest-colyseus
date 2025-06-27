import {
  MongoosePaginateParams,
  Paginated,
} from '@libs/pagination/paginated.interface';
import { paginateMongoose } from '@libs/utils/paginated-mongoose.util';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly model: Model<UserDocument>,
  ) {}

  async findPaginated(
    params: MongoosePaginateParams,
  ): Promise<Paginated<UserDocument>> {
    return paginateMongoose(this.model, params);
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.model.findById(id);
  }
}
