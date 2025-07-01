import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PetStats } from 'src/schema/pet.schema';

// Interface cho stat decay
class StatDecayRange {
  @Prop({ required: true })
  min: number;

  @Prop({ required: true })
  max: number;
}

// Interface cho stat decay object
class StatDecay {
  @Prop({ type: StatDecayRange, required: true })
  happiness: StatDecayRange;

  @Prop({ type: StatDecayRange, required: true })
  hunger: StatDecayRange;

  @Prop({ type: StatDecayRange, required: true })
  cleanliness: StatDecayRange;
}

@Schema()
export class PetType extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: PetStats, required: true })
  default_stats: PetStats;

  @Prop({ required: true })
  image_url: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: StatDecay, required: true })
  stat_decay: StatDecay;
}

export const PetTypeSchema = SchemaFactory.createForClass(PetType);
