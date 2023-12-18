import { Controller, Get } from '@nestjs/common';
import { TariffService } from './tariff.service';

@Controller('tariff')
export class TariffController {
  constructor(private tariffService: TariffService) {}

  @Get()
  async getAllTariffs(): Promise<any[]> {
    const tariffs = await this.tariffService.getAllTariffs();
    return tariffs.map(({ _id, name, trips, price, type }) => ({ id: _id, name, trips, price, type }));
  }
}
