import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { CardService } from './card.service';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

interface CurrentTariff {
  tariffId: Types.ObjectId;
  tripsRemaining: number;
  expiryDate: Date;
}

@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @UseGuards(AuthGuard())
  @Post('/add')
  async addCard(@Request() req: any): Promise<void> {
    const userId = req.user.id;
    await this.cardService.addCard(userId);
  }

  @UseGuards(AuthGuard())
  @Get()
  async getCardDetails(@Request() req: any): Promise<{ cardNumber: number, expirationDate: Date, isActive: boolean, currentTariff: CurrentTariff  }> {
    const userId = req.user.id; // Получение идентификатора пользователя из токена
    const card = await this.cardService.getCardDetails(userId);
    return {
      cardNumber: card.cardNumber,
      expirationDate: card.expirationDate,
      isActive: card.isActive,
      currentTariff: card.currentTariff,
    };
  }
}
