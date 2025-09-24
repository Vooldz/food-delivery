import { IsUUID, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateDeliveryDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsUUID()
  driverId: string;

  @IsOptional()
  @IsDateString()
  assignedAt?: Date;
}
