import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdmissionsService } from './admissions.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  // ================= TIMELINE =================
  @Get('timeline')
  getTimelines() {
    return this.admissionsService.getTimelines();
  }

  @Post('timeline')
  @UseGuards(AdminGuard)
  createTimeline(@Body() data: any) {
    return this.admissionsService.createTimeline(data);
  }

  @Put('timeline/:id')
  @UseGuards(AdminGuard)
  updateTimeline(@Param('id') id: string, @Body() data: any) {
    return this.admissionsService.updateTimeline(id, data);
  }

  @Delete('timeline/:id')
  @UseGuards(AdminGuard)
  deleteTimeline(@Param('id') id: string) {
    return this.admissionsService.deleteTimeline(id);
  }

  // ================= REMINDERS =================
  @Get('reminders')
  getReminders(@Query('includeInactive') includeInactive?: string) {
    return this.admissionsService.getReminders(includeInactive === 'true');
  }

  @Post('reminders')
  @UseGuards(AdminGuard)
  createReminder(@Body() data: any) {
    return this.admissionsService.createReminder(data);
  }

  @Put('reminders/:id')
  @UseGuards(AdminGuard)
  updateReminder(@Param('id') id: string, @Body() data: any) {
    return this.admissionsService.updateReminder(id, data);
  }

  @Delete('reminders/:id')
  @UseGuards(AdminGuard)
  deleteReminder(@Param('id') id: string) {
    return this.admissionsService.deleteReminder(id);
  }

  // ================= REQUIREMENTS =================
  @Get('requirements')
  getRequirements(
    @Query('category') category?: string,
    @Query('degreeLevel') degreeLevel?: string,
  ) {
    return this.admissionsService.getRequirements(category, degreeLevel);
  }

  @Post('requirements')
  @UseGuards(AdminGuard)
  createRequirement(@Body() data: any) {
    return this.admissionsService.createRequirement(data);
  }

  @Put('requirements/:id')
  @UseGuards(AdminGuard)
  updateRequirement(@Param('id') id: string, @Body() data: any) {
    return this.admissionsService.updateRequirement(id, data);
  }

  @Delete('requirements/:id')
  @UseGuards(AdminGuard)
  deleteRequirement(@Param('id') id: string) {
    return this.admissionsService.deleteRequirement(id);
  }

  // ================= FAQS =================
  @Get('faqs')
  getFaqs(
    @Query('category') category?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.admissionsService.getFaqs(category, includeInactive === 'true');
  }

  @Post('faqs')
  @UseGuards(AdminGuard)
  createFaq(@Body() data: any) {
    return this.admissionsService.createFaq(data);
  }

  @Put('faqs/:id')
  @UseGuards(AdminGuard)
  updateFaq(@Param('id') id: string, @Body() data: any) {
    return this.admissionsService.updateFaq(id, data);
  }

  @Delete('faqs/:id')
  @UseGuards(AdminGuard)
  deleteFaq(@Param('id') id: string) {
    return this.admissionsService.deleteFaq(id);
  }

  // ================= MATERIALS =================
  @Get('materials')
  getMaterials(@Query('includeInactive') includeInactive?: string) {
    return this.admissionsService.getMaterials(includeInactive === 'true');
  }

  @Post('materials')
  @UseGuards(AdminGuard)
  createMaterial(@Body() data: any) {
    return this.admissionsService.createMaterial(data);
  }

  @Put('materials/:id')
  @UseGuards(AdminGuard)
  updateMaterial(@Param('id') id: string, @Body() data: any) {
    return this.admissionsService.updateMaterial(id, data);
  }

  @Delete('materials/:id')
  @UseGuards(AdminGuard)
  deleteMaterial(@Param('id') id: string) {
    return this.admissionsService.deleteMaterial(id);
  }
}
