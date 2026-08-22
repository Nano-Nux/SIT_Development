import { Module } from '@nestjs/common';
import { RequestInfoService } from './request-info.service';
import { RequestInfoController } from './request-info.controller';

@Module({
  controllers: [RequestInfoController],
  providers: [RequestInfoService],
  exports: [RequestInfoService],
})
export class RequestInfoModule {}
