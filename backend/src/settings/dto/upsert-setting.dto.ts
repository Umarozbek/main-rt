import { IsString, MinLength } from 'class-validator';

export class UpsertSettingDto {
  @IsString()
  @MinLength(1)
  key: string;

  @IsString()
  value: string;
}
