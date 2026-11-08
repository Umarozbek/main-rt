import { PartialType } from '@nestjs/mapped-types';
import { CreateFleetItemDto } from './create-fleet-item.dto';

export class UpdateFleetItemDto extends PartialType(CreateFleetItemDto) {}
