import { Module } from '@nestjs/common';
import { SpotlightsService } from './spotlights.service';
import { SpotlightsController } from './spotlights.controller';

@Module({
  controllers: [SpotlightsController],
  providers: [SpotlightsService],
  exports: [SpotlightsService],
})
export class SpotlightsModule {}
