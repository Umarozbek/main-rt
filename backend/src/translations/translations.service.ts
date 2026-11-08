import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertTranslationDto } from './dto/upsert-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(private prisma: PrismaService) {}

  async findByLang(lang: string) {
    const rows = await this.prisma.translation.findMany({ where: { lang } });
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return map;
  }

  findAll() {
    return this.prisma.translation.findMany({ orderBy: [{ key: 'asc' }, { lang: 'asc' }] });
  }

  upsert(dto: UpsertTranslationDto) {
    return this.prisma.translation.upsert({
      where: { key_lang: { key: dto.key, lang: dto.lang } },
      update: { value: dto.value },
      create: dto,
    });
  }

  async bulkUpsert(items: UpsertTranslationDto[]) {
    const results = [];
    for (const dto of items) {
      results.push(await this.upsert(dto));
    }
    return results;
  }

  async remove(id: string) {
    const item = await this.prisma.translation.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Translation not found');
    return this.prisma.translation.delete({ where: { id } });
  }
}
