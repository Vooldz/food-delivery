import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsNumber()
  @IsOptional()
  totalPrice?: number;

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
