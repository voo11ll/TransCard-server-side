import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Tariff } from '../tariff/tariff.schema';

export enum CardType {
  Privileged = 'privileged',
  Standard = 'standard',
  Student = 'student',
}

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

  @Prop({ required: true, 
    enum: [CardType.Privileged, CardType.Standard, CardType.Student], 
    default: CardType.Standard })
  cardType: string;

  // @Prop({
  //   type: {
  //     type: String,
  //     enum: [CardType.Privileged, CardType.Standard, CardType.Student],
  //     default: CardType.Standard,
  //   },
  // })
  // cardType: CardType;

  @Prop({
    type: {
      tariffId: { type: Types.ObjectId, ref: 'Tariff' }, // измените эту строку
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
