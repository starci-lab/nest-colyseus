import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '@libs/database/base.schema';
import { isAddress } from 'ethers';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // tự tạo createdAt, updatedAt
export class User {
  @Prop({
    type: String,
    unique: true,
    sparse: true,
    maxlength: 50,
    validate: {
      validator: (v: string) => isAddress(v),
      message: (props) => `${props.value} is not a valid wallet address`,
    },
  })
  wallet_address: string;

  @Prop({ default: '' })
  nickname?: string;

  @Prop({ type: Date, default: null })
  last_active_at?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
