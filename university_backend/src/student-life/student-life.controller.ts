import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StudentLifeService } from './student-life.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('student-life')
export class StudentLifeController {
  constructor(private readonly studentLifeService: StudentLifeService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.studentLifeService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentLifeService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.studentLifeService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.studentLifeService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.studentLifeService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.studentLifeService.remove(id);
  }
}
