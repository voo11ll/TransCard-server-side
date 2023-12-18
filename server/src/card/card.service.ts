import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Card, CardType } from './card.schema';
import { Tariff } from 'src/tariff/tariff.schema';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name)
    private cardModel: Model<Card>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Tariff.name)
    private tariffModel: Model<Tariff>,
  ) {}

  // Логика покупки тарифа
  async purchaseTariff(userId: string, tariffType: string): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const card = await this.cardModel.findOne({ owner: user._id, isActive: true });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const tariff = await this.tariffModel.findOne({ type: tariffType });

    if (!tariff) {
      throw new NotFoundException('Tariff not found');
    }

    // Проверка, достаточно ли средств для покупки тарифа
    const isPaymentSuccessful = this.simulatePayment(); // Замените этот вызов на свою логику оплаты

    if (!isPaymentSuccessful) {
      throw new ConflictException('Payment failed. Insufficient funds.');
    }

    // Установка текущего тарифа для карты
    card.currentTariff = tariff._id;
    await card.save();
  }
  private simulatePayment(): boolean {
    // Реализовать свою логику оплаты
    // Например, проверка баланса карты, списание средств и т.д.
    // Верните true, если оплата успешна, и false в противном случае.
    return true; // Временно всегда считаем оплату успешной
  }


   // Логика добавления карты
  async addCard(userId: string, cardType: string): Promise<Card> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCard = await this.cardModel.findOne({ owner: user._id, isActive: true });

    if (existingCard) {
      throw new ConflictException('Card already issued for the user');
    }
    const tariff = await this.tariffModel.findOne({ type: cardType });

    if (!tariff) {
      throw new NotFoundException('Tariff not found');
    }

    const card = await this.cardModel.create({
      cardNumber: generateCardNumber(),
      owner: user._id,
      expirationDate: calculateExpirationDate(),
      isActive: true,
      currentTariff: {
        tariffId: tariff._id,
        tripsRemaining: tariff.trips,
        expiryDate: calculateExpirationDateForTariff(),
      },
      cardType: cardType,
    });

    return card;
  }
  
  // Логика получения деталей карты
  async getCardDetails(userId: string): Promise<Card> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const card = await this.cardModel.findOne({ 'owner': user._id, isActive: true });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async deactivateExpiredCards(): Promise<void> {
    const currentDate = new Date();
    await this.cardModel.updateMany(
      { expirationDate: { $lt: currentDate }, isActive: true },
      { $set: { isActive: false } },
    );
  }
}



function calculateExpirationDate(): Date {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
  
    // Устанавливаем месяц на 12 месяцев вперед
    expirationDate.setMonth(currentDate.getMonth() + 12);
  
    // Устанавливаем день на 1-е число месяца
    expirationDate.setDate(1);
  
    return expirationDate;
}

function generateCardNumber(): string {
    // Генерация идентификатора эмитента (от 10000 до 99999)
    const issuerId = Math.floor(10000 + Math.random() * 90000);
  
    // Собираем первые 6 цифр с идентификатором эмитента
    const partialCardNumber = `2${issuerId.toString().substring(0, 5)}`;
  
    // Добавляем 10 случайных цифр после идентификатора эмитента
    let cardNumber = `${partialCardNumber}${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  
    // Рассчитываем контрольную сумму по алгоритму Луна
    const checksum = calculateLuhnChecksum(cardNumber);
  
    // Добавляем контрольную сумму в конец номера карты
    cardNumber += checksum;
  
    return cardNumber;
}


function calculateExpirationDateForTariff(): Date {
  const currentDate = new Date();
  const expirationDate = new Date(currentDate);

  // Устанавливаем месяц на 12 месяцев вперед
  expirationDate.setMonth(currentDate.getMonth() + 12);

  // Устанавливаем день на 1-е число месяца
  expirationDate.setDate(1);

  return expirationDate;
}

function calculateLuhnChecksum(cardNumber: string): number {
    const digits = cardNumber.split('').map(Number);

    let sum = 0;
    let isSecondDigit = false;

    // Проходим через каждую цифру справа налево
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];

        // Удваиваем каждую вторую цифру
        if (isSecondDigit) {
        digit *= 2;

        // Если результат больше 9, вычитаем 9
        if (digit > 9) {
            digit -= 9;
        }
        }

        // Суммируем все цифры
        sum += digit;

        // Переключаем флаг для следующей цифры
        isSecondDigit = !isSecondDigit;
    }

    // Рассчитываем контрольную сумму (число, которое нужно добавить к сумме, чтобы получить кратность 10)
    const checksum = (10 - (sum % 10)) % 10;

    return checksum;
}
