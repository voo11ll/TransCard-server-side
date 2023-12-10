import { IsNotEmpty, IsString } from 'class-validator';

export class AddCardDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}