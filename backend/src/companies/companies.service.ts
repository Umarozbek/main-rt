import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    const existing = await this.prisma.company.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Company slug already exists');
    return this.prisma.company.create({ data: dto });
  }

  findAll(visibleOnly = false) {
    const where = visibleOnly ? { visible: true } : {};
    return this.prisma.company.findMany({ where, orderBy: { sortOrder: 'asc' } });
  }

  async findBySlug(slug: string) {
    const company = await this.prisma.company.findUnique({ where: { slug } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    await this.findOne(id);
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.company.delete({ where: { id } });
  }
}
