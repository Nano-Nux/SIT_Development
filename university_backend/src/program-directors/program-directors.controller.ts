import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProgramDirectorsService } from './program-directors.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('program-directors')
export class ProgramDirectorsController {
  constructor(private readonly programDirectorsService: ProgramDirectorsService) {}

  @Get()
  findAll(@Query('programId') programId?: string) {
    return this.programDirectorsService.findAll(programId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programDirectorsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.programDirectorsService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.programDirectorsService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.programDirectorsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.programDirectorsService.remove(id);
  }
}
