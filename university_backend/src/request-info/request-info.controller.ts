import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { RequestInfoService } from './request-info.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('request-info')
export class RequestInfoController {
  constructor(private readonly requestInfoService: RequestInfoService) {}

  @Post()
  submit(@Body() body: any) {
    return this.requestInfoService.submit(body);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.requestInfoService.findAll({
      status,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.requestInfoService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string },
  ) {
    return this.requestInfoService.updateStatus(id, body.status, body.notes);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.requestInfoService.remove(id);
  }
}
