import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { HeroService } from './hero.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  findAll() {
    return this.heroService.findAll();
  }

  @Get(':page')
  findByPage(@Param('page') page: string) {
    return this.heroService.findByPage(page);
  }

  @Post()
  @UseGuards(AdminGuard)
  upsertRoot(@Body() data: any) {
    const page = data.page || 'HOME';
    return this.heroService.upsert(page, data);
  }

  @Post(':page')
  @UseGuards(AdminGuard)
  upsertPagePost(@Param('page') page: string, @Body() data: any) {
    return this.heroService.upsert(page, data);
  }

  @Put(':page')
  @UseGuards(AdminGuard)
  upsert(@Param('page') page: string, @Body() data: any) {
    return this.heroService.upsert(page, data);
  }
}
