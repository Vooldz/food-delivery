import { IsUUID, IsInt, Min, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsUUID()
  @IsNotEmpty()
  menuItemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
