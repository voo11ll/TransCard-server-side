import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card, CardSchema } from './card.schema';
import { User, UserSchema } from '../user/user.schema';
import { AuthModule } from '../auth/auth.module';
import { TariffModule } from 'src/tariff/tariff.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    TariffModule,
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
