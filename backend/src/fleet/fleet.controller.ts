import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { FleetService } from './fleet.service';
import { CreateFleetItemDto } from './dto/create-fleet-item.dto';
import { UpdateFleetItemDto } from './dto/update-fleet-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('fleet')
export class FleetController {
  constructor(private fleetService: FleetService) {}

  @Get()
  findAll() {
    return this.fleetService.findAll(true);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.fleetService.findAll(false);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fleetService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFleetItemDto) {
    return this.fleetService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFleetItemDto) {
    return this.fleetService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fleetService.remove(id);
  }
}
