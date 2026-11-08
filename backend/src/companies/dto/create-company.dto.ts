import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  slug: string;

  @IsString()
  nameUz: string;

  @IsString()
  @IsOptional()
  nameRu?: string;

  @IsString()
  @IsOptional()
  nameEn?: string;

  @IsString()
  descUz: string;

  @IsString()
  @IsOptional()
  descRu?: string;

  @IsString()
  @IsOptional()
  descEn?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  instagram?: string;

  @IsString()
  @IsOptional()
  telegram?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;
}
