import { Module } from '@nestjs/common';
import { CampusFacilitiesService } from './campus-facilities.service';
import { CampusFacilitiesController } from './campus-facilities.controller';

@Module({
  controllers: [CampusFacilitiesController],
  providers: [CampusFacilitiesService],
  exports: [CampusFacilitiesService],
})
export class CampusFacilitiesModule {}
