import { Injectable } from '@nestjs/common';
import { BaseRepo } from '../base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TTask } from './task.model';

@Injectable()
export class TaskRepo extends BaseRepo<TTask> {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TTask>,
  ) {
    super(taskModel);
  }
}
