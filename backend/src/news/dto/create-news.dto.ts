import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  titleUz: string;

  @IsString()
  @IsOptional()
  titleRu?: string;

  @IsString()
  @IsOptional()
  titleEn?: string;

  @IsString()
  bodyUz: string;

  @IsString()
  @IsOptional()
  bodyRu?: string;

  @IsString()
  @IsOptional()
  bodyEn?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsDateString()
  @IsOptional()
  publishDate?: string;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
