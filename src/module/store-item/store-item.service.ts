import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStoreItemDto } from './dto/create-store-item.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { StoreItem } from 'src/schema/store-item.schema';
import { Model } from 'mongoose';

@Injectable()
export class StoreItemService {
  constructor(
    @InjectModel(StoreItem.name) private storeItemModel: Model<StoreItem>,
  ) {}
  create(createStoreItemDto: CreateStoreItemDto) {
    return 'This action adds a new storeItem';
  }

  findAll() {
    return this.storeItemModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} storeItem`;
  }

  update(id: number, updateStoreItemDto: UpdateStoreItemDto) {
    return `This action updates a #${id} storeItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} storeItem`;
  }
}
