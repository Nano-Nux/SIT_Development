import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CoreValuesService } from './core-values.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('core-values')
export class CoreValuesController {
  constructor(private readonly coreValuesService: CoreValuesService) {}

  @Get()
  findAll(@Query('all') all?: string) {
    return this.coreValuesService.findAll(all === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coreValuesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.coreValuesService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.coreValuesService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.coreValuesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.coreValuesService.remove(id);
  }
}
