import { IsString, MinLength } from 'class-validator';

export class UpsertTranslationDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  @MinLength(1)
  lang: string;

  @IsString()
  value: string;
}
