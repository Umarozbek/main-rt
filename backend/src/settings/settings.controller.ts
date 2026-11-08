import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Body() dto: UpsertSettingDto) {
    return this.settingsService.upsert(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
