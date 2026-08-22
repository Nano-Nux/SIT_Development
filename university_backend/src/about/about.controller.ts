import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('founder')
  getFounder() {
    return this.aboutService.getFounder();
  }

  @Put('founder')
  @UseGuards(AdminGuard)
  updateFounder(@Body() data: any) {
    return this.aboutService.updateFounder(data);
  }

  @Get('vision-mission')
  getVisionMission() {
    return this.aboutService.getVisionMission();
  }

  @Put('vision-mission')
  @UseGuards(AdminGuard)
  updateVisionMission(@Body() data: any) {
    return this.aboutService.updateVisionMission(data);
  }

  @Get('members')
  getMembers(@Query('category') category?: string) {
    return this.aboutService.getMembers(category);
  }

  @Get('members/:id')
  getMember(@Param('id') id: string) {
    return this.aboutService.getMember(id);
  }

  @Post('members')
  @UseGuards(AdminGuard)
  createMember(@Body() data: any) {
    return this.aboutService.createMember(data);
  }

  @Put('members/reorder')
  @UseGuards(AdminGuard)
  reorderMembers(@Body() body: { items: { id: string; order: number }[] }) {
    return this.aboutService.reorderMembers(body.items);
  }

  @Put('members/:id')
  @UseGuards(AdminGuard)
  updateMember(@Param('id') id: string, @Body() data: any) {
    return this.aboutService.updateMember(id, data);
  }

  @Delete('members/:id')
  @UseGuards(AdminGuard)
  deleteMember(@Param('id') id: string) {
    return this.aboutService.deleteMember(id);
  }

  @Get('history')
  getHistory() {
    return this.aboutService.getHistory();
  }

  @Post('history')
  @UseGuards(AdminGuard)
  createHistory(@Body() data: any) {
    return this.aboutService.createHistory(data);
  }

  @Put('history/:id')
  @UseGuards(AdminGuard)
  updateHistory(@Param('id') id: string, @Body() data: any) {
    return this.aboutService.updateHistory(id, data);
  }

  @Delete('history/:id')
  @UseGuards(AdminGuard)
  deleteHistory(@Param('id') id: string) {
    return this.aboutService.deleteHistory(id);
  }
}
