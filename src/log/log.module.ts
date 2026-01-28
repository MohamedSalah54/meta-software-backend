import { Module } from '@nestjs/common';
import { LogModel } from 'src/db/log/log.model';
import { LogRepo } from 'src/db/log/log.repo';
import { AuthModule } from 'src/auth/auth.module';
import { LogsController } from './log.controller';
import { LogsService } from './log.service';

@Module({
  imports: [
    AuthModule,
    LogModel, 
    
  ],
  controllers: [LogsController],
  providers: [LogsService, LogRepo],
  exports: [LogsService],
})
export class LogsModule {}
