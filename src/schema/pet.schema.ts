import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Tái sử dụng class PetStats
export class PetStats {
  @Prop({ required: true })
  happiness: number;

  @Prop({ required: true })
  hunger: number;

  @Prop({ required: true })
  cleanliness: number;
}

@Schema({ timestamps: true })
export class Pet extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PetType', required: true })
  type: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: PetStats, required: true })
  stats: PetStats;

  @Prop({ required: true })
  status: string; // ex: 'idle', 'sleeping', 'hungry'
}

export const PetSchema = SchemaFactory.createForClass(Pet);
