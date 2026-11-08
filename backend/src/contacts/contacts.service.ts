import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateContactDto) {
    return this.prisma.contact.create({ data: dto });
  }

  findAll(status?: string) {
    const where = status ? { status: status as any } : {};
    return this.prisma.contact.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async update(id: string, dto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contact.delete({ where: { id } });
  }
}
