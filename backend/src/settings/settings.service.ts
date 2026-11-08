import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async findByKey(key: string) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { key } });
    if (!setting) throw new NotFoundException(`Setting "${key}" not found`);
    return setting;
  }

  upsert(dto: UpsertSettingDto) {
    return this.prisma.siteSetting.upsert({
      where: { key: dto.key },
      update: { value: dto.value },
      create: dto,
    });
  }

  async remove(key: string) {
    await this.findByKey(key);
    return this.prisma.siteSetting.delete({ where: { key } });
  }
}
