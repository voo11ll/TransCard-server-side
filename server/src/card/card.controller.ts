import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { CardService } from './card.service';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { Card, CardType } from './card.schema';

interface CurrentTariff {
  purchasedTariff: Types.ObjectId;
  tripsRemaining: number;
  expiryDate: Date;
}

@Controller('card')
export class CardController {
  constructor(private cardService: CardService) {}

  @UseGuards(AuthGuard())
  @Post('/add')
  async addCard(@Request() req: any, @Body('cardType') cardType: string): Promise<Card> {
    const userId = req.user.id;
    const card = await this.cardService.addCard(userId, cardType);
    
    console.log('Ответ от сервера:', card);
    return card;
  }

  @UseGuards(AuthGuard())
  @Get()
  async getCardDetails(@Request() req: any): Promise<{ cardNumber: number, expirationDate: Date, isActive: boolean, currentTariff: CurrentTariff, cardType: string }> {
    const userId = req.user.id;
    const card = await this.cardService.getCardDetails(userId);

    const currentTariff: CurrentTariff = {
      purchasedTariff: card.currentTariff.purchasedTariff,
      tripsRemaining: card.currentTariff.tripsRemaining,
      expiryDate: card.currentTariff.expiryDate,
    };

    return {
      cardNumber: card.cardNumber,
      expirationDate: card.expirationDate,
      isActive: card.isActive,
      currentTariff: currentTariff,
      cardType: card.cardType,
    };
  }

  @UseGuards(AuthGuard())
  @Post('/purchase-tariff')
  async purchaseTariff(@Request() req: any, @Body('tariffType') tariffType: string): Promise<{ message: string }> {
    const userId = req.user.id;
    await this.cardService.purchaseTariff(userId, tariffType);
    return { message: 'Tariff purchased successfully' };
  }

}
