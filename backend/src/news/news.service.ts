import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateNewsDto) {
    return this.prisma.newsArticle.create({ data: dto });
  }

  findAll(visibleOnly = false) {
    const where = visibleOnly ? { visible: true } : {};
    return this.prisma.newsArticle.findMany({
      where,
      orderBy: { publishDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.newsArticle.findUnique({ where: { id } });
    if (!article) throw new NotFoundException('News article not found');
    return article;
  }

  async update(id: string, dto: UpdateNewsDto) {
    await this.findOne(id);
    return this.prisma.newsArticle.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.newsArticle.delete({ where: { id } });
  }
}
