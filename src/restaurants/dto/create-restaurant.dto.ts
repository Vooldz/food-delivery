import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  address: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Image URL cannot exceed 255 characters' })
  image?: string;
}
