import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsInt, Min, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}
