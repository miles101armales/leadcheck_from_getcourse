import { Module } from '@nestjs/common';
import { GoogleapisService } from './googleapis.service';
import { GoogleapisController } from './googleapis.controller';

@Module({
  controllers: [GoogleapisController],
  providers: [GoogleapisService],
})
export class GoogleapisModule {}
