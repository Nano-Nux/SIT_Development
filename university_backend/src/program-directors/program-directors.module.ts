import { Module } from '@nestjs/common';
import { ProgramDirectorsService } from './program-directors.service';
import { ProgramDirectorsController } from './program-directors.controller';

@Module({
  controllers: [ProgramDirectorsController],
  providers: [ProgramDirectorsService],
  exports: [ProgramDirectorsService],
})
export class ProgramDirectorsModule {}
