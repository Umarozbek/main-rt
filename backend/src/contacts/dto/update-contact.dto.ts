import { IsEnum, IsOptional, IsString } from 'class-validator';

enum ContactStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export class UpdateContactDto {
  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
