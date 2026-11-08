import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFleetItemDto } from './dto/create-fleet-item.dto';
import { UpdateFleetItemDto } from './dto/update-fleet-item.dto';

@Injectable()
export class FleetService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFleetItemDto) {
    return this.prisma.fleetItem.create({ data: dto });
  }

  findAll(visibleOnly = false) {
    const where = visibleOnly ? { visible: true } : {};
    return this.prisma.fleetItem.findMany({ where, orderBy: { sortOrder: 'asc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.fleetItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Fleet item not found');
    return item;
  }

  async update(id: string, dto: UpdateFleetItemDto) {
    await this.findOne(id);
    return this.prisma.fleetItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fleetItem.delete({ where: { id } });
  }
}
