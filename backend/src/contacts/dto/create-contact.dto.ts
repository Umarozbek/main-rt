import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  phone: string;

  @IsString()
  @IsOptional()
  service?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
