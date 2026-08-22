import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(
    @Query('upcoming') upcoming?: string,
    @Query('limit') limit?: string,
    @Query('all') all?: string,
  ) {
    return this.eventsService.findAll({
      upcomingOnly: upcoming === 'true',
      limit: limit ? Number(limit) : undefined,
      all: all === 'true',
    });
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.eventsService.findBySlug(idOrSlug).catch(() => this.eventsService.findOne(idOrSlug));
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() data: any) {
    return this.eventsService.create(data);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.eventsService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
