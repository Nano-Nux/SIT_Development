import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CampusFacilitiesService } from './campus-facilities.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('campus-facilities')
export class CampusFacilitiesController {
  constructor(private readonly campusFacilitiesService: CampusFacilitiesService) {}

  @Get()
  findAll() {
    return this.campusFacilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campusFacilitiesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.campusFacilitiesService.create(data);
  }

  @Put('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() body: { items: { id: string; order: number }[] }) {
    return this.campusFacilitiesService.reorder(body.items);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.campusFacilitiesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.campusFacilitiesService.remove(id);
  }
}
