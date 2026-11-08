import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { UpsertTranslationDto } from './dto/upsert-translation.dto';
import { BulkUpsertDto } from './dto/bulk-upsert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('translations')
export class TranslationsController {
  constructor(private translationsService: TranslationsService) {}

  @Get(':lang')
  findByLang(@Param('lang') lang: string) {
    return this.translationsService.findByLang(lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.translationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Body() dto: UpsertTranslationDto) {
    return this.translationsService.upsert(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkUpsert(@Body() dto: BulkUpsertDto) {
    return this.translationsService.bulkUpsert(dto.translations);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationsService.remove(id);
  }
}
