import { PartialType } from '@nestjs/swagger';
import { CreateFleetItemDto } from './create-fleet-item.dto';

export class UpdateFleetItemDto extends PartialType(CreateFleetItemDto) {}
