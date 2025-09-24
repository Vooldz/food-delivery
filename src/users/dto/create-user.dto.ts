import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirmPassword: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
