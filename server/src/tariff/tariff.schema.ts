import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tariff extends Document {
  @Prop()
  name: string;

  @Prop()
  trips: number;

  @Prop()
  price: number;

  @Prop()
  type: string; 
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
