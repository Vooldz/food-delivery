import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  restaurantId: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsDateString()
  @IsOptional()
  estimatedDeliveryTime?: string;
}
