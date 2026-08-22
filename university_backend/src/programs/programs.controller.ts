import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Get()
  findAll(
    @Query('departmentId') departmentId?: string,
    @Query('degree') degree?: string,
    @Query('all') all?: string,
  ) {
    return this.programsService.findAll({
      departmentId,
      degree,
      all: all === 'true',
    });
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.programsService.findBySlug(idOrSlug).catch(() => this.programsService.findOne(idOrSlug));
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.programsService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.programsService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.programsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.programsService.remove(id);
  }
}
