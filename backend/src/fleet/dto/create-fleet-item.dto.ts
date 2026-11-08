import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateFleetItemDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  power?: string;

  @IsString()
  @IsOptional()
  bucket?: string;

  @IsString()
  @IsOptional()
  digDepth?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  hours?: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
