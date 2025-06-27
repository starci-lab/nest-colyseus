import { Prop } from '@nestjs/mongoose';

export abstract class BaseSchema {
  @Prop({ type: Date, default: () => new Date(), required: true })
  createdAt: Date;

  @Prop({ type: String, required: true })
  createdBy: string;

  @Prop({ type: Date, default: () => new Date(), required: true })
  updatedAt: Date;

  @Prop({ type: String, required: false })
  updatedBy: string;
}
