import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MajorsService } from './majors.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('majors')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.majorsService.findAll(all === 'true');
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    if (idOrSlug.includes('-') || isNaN(Number(idOrSlug)) && idOrSlug.length !== 36) {
      // Could be slug or UUID
      return this.majorsService.findBySlug(idOrSlug).catch(() => this.majorsService.findOne(idOrSlug));
    }
    return this.majorsService.findOne(idOrSlug).catch(() => this.majorsService.findBySlug(idOrSlug));
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.majorsService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.majorsService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.majorsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.majorsService.remove(id);
  }
}
