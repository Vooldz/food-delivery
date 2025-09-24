import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  license: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  vehicle: string;
}
