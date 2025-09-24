import { IsOptional, IsUUID, IsDateString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsOptional()
  @IsDateString()
  assignedAt?: Date;

  @IsOptional()
  @IsDateString()
  pickedUpAt?: Date;

  @IsOptional()
  @IsDateString()
  deliveredAt?: Date;
}
