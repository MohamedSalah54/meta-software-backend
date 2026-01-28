import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateTaskDto) {
    const task = await this.taskService.createForMe(user.id, dto);
    return { success: true, message: 'task created', data: task };
  }

  @Get()
  async getMyTasks(@CurrentUser() user: any) {
    const tasks = await this.taskService.getTasksForMe(user.id);
    return { success: true, data: tasks };
  }

  @Get(':id')
  async getOne(@CurrentUser() user: any, @Param('id') id: string) {
    const task = await this.taskService.getOneForMe(user.id, id);
    return { success: true, data: task };
  }

  @Patch(':id')
  async patchOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const task = await this.taskService.patchOneForMe(user.id, id, dto);
    return { success: true, message: 'task updated', data: task };
  }

  @Delete(':id')
  async deleteOne(@CurrentUser() user: any, @Param('id') id: string) {
    const deleted = await this.taskService.deleteOneForMe(user.id, id);
    return { success: true, message: 'task deleted', data: deleted };
  }
}
