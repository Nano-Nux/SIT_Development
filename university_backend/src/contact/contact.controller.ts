import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  getContactInfo() {
    return this.contactService.getContactInfo();
  }

  @Put()
  @UseGuards(AdminGuard)
  updateContactInfo(@Body() data: any) {
    return this.contactService.updateContactInfo(data);
  }
}
