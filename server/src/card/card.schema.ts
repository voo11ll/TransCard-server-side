import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

@Schema({
  timestamps: true,
})
export class Card extends Document {
  @Prop({unique: [true, 'Duplicate card number']})
  cardNumber: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      tariffId: Types.ObjectId,
      tripsRemaining: Number,
      expiryDate: Date,
    },
    default: null,
  })
  currentTariff: {
    tariffId: Types.ObjectId;
    tripsRemaining: number;
    expiryDate: Date;
  };
}

export const CardSchema = SchemaFactory.createForClass(Card);
