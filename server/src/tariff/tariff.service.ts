import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tariff } from './tariff.schema';

@Injectable()
export class TariffService {
  constructor(@InjectModel(Tariff.name) private tariffModel: Model<Tariff>) {}

  async getAllTariffs(): Promise<Tariff[]> {
    // Создаем заготовленные тарифы, если их еще нет
    await this.createDefaultTariffs();

    return this.tariffModel.find().exec();
  }

  private async createDefaultTariffs(): Promise<void> {
    const existingTariffs = await this.tariffModel.find().exec();

    if (existingTariffs.length === 0) {
      // Создаем заготовленные тарифы
      const tariffs = [
        { name: 'Basic', trips: 10, price: 10.0, type: 'basic' },
        { name: 'Standard', trips: 20, price: 15.0, type: 'standard' },
        { name: 'Premium', trips: 30, price: 20.0, type: 'premium' },
      ];

      await this.tariffModel.create(tariffs);
    }
  }
}
