import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { Tariff, TariffSchema } from './tariff.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tariff.name, schema: TariffSchema }])],
  controllers: [TariffController],
  providers: [TariffService],
  exports: [TariffService, MongooseModule], // добавьте эту строку
})
export class TariffModule {}
