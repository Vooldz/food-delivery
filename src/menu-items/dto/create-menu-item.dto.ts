import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  image?: string;

  @IsUUID()
  @IsOptional()
  restaurantId: string;
}
