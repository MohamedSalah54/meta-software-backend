import { Module } from '@nestjs/common';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';

import { TaskRepo } from 'src/db/task/task.repo';
import { TaskModel } from 'src/db/task/task.model';

import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TaskModel, 
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepo],
  exports: [TaskService],
})
export class TaskModule {}
