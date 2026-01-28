import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { TaskRepo } from 'src/db/task/task.repo';

import { TaskStatus } from 'src/common/enum';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepo) {}

  async createForMe(userId: string, dto: CreateTaskDto) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');

    const created = await this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      status: TaskStatus.AVAILABLE,
      user: new Types.ObjectId(userId),
    } as any);

    return this.mapTask(created);
  }

  async getTasksForMe(userId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');

    const tasks = await this.taskRepo.find({
      filter: { user: new Types.ObjectId(userId) } as any,
      sort: { createdAt: -1 } as any,
      limit: 50,
      skip: 0,
    });

    return (tasks as any[]).map((t) => this.mapTask(t));
  }

  async getOneForMe(userId: string, taskId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');
    if (!Types.ObjectId.isValid(taskId)) throw new BadRequestException('Invalid task id');

    const task = await this.taskRepo.findOne({
      filter: {
        _id: new Types.ObjectId(taskId),
        user: new Types.ObjectId(userId),
      } as any,
    });

    if (!task) throw new NotFoundException('Task not found');

    return this.mapTask(task);
  }

  async patchOneForMe(userId: string, taskId: string, dto: UpdateTaskDto) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');
    if (!Types.ObjectId.isValid(taskId)) throw new BadRequestException('Invalid task id');

    const update: any = {};
    if (dto.title !== undefined) update.title = dto.title;
    if (dto.description !== undefined) update.description = dto.description;
    if (dto.status !== undefined) update.status = dto.status;

    if (!Object.keys(update).length) {
      throw new BadRequestException('No fields to update');
    }

    const updated = await this.taskRepo.updateOne({
      filter: {
        _id: new Types.ObjectId(taskId),
        user: new Types.ObjectId(userId),
      } as any,
      update: { $set: update } as any,
    });

    if (!updated) throw new NotFoundException('Task not found');

    return this.mapTask(updated);
  }

  async deleteOneForMe(userId: string, taskId: string) {
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');
    if (!Types.ObjectId.isValid(taskId)) throw new BadRequestException('Invalid task id');

    const result = await this.taskRepo.deleteOne({
      _id: new Types.ObjectId(taskId),
      user: new Types.ObjectId(userId),
    } as any);

    if (!result?.deletedCount) throw new NotFoundException('Task not found');

    return { id: taskId };
  }

  private mapTask(task: any) {
    const { _id, title, description, status, user, createdAt, updatedAt } = task;
    return {
      id: _id.toString(),
      title,
      description,
      status,
      user: user?.toString?.() ?? user,
      createdAt,
      updatedAt,
    };
  }
}
