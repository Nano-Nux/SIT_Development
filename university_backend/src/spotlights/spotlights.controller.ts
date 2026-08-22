import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SpotlightsService } from './spotlights.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('spotlights')
export class SpotlightsController {
  constructor(private readonly spotlightsService: SpotlightsService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('all') all?: string,
  ) {
    return this.spotlightsService.findAll({
      type,
      all: all === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotlightsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.spotlightsService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.spotlightsService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.spotlightsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.spotlightsService.remove(id);
  }
}
