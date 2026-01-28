import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LogRepo } from 'src/db/log/log.repo';
import { LogsQueryDto } from './dto';

@Injectable()
export class LogsService {
  constructor(private readonly logRepo: LogRepo) {}

  async create(data: { action: string; user?: string; ipAddress?: string }) {
    const doc: any = {
      action: data.action,
      ipAddress: data.ipAddress,
    };

    if (data.user && Types.ObjectId.isValid(data.user)) {
      doc.user = new Types.ObjectId(data.user);
    }

    return this.logRepo.create(doc);
  }
  async getAllLogs(query: LogsQueryDto) {
    const { limit = 50, skip = 0, action } = query;

    const filter: any = {};
    if (action) filter.action = action;

    const logs = await this.logRepo.find({
      filter,
      limit,
      skip,
      sort: { createdAt: -1 } as any,
      populate: [{ path: 'user', select: 'email role' }] as any,
    });

    return (logs as any[]).map(this.mapLog);
  }

  async getUserLogs(userId: string, query: LogsQueryDto) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const { limit = 50, skip = 0, action } = query;

    const filter: any = { user: new Types.ObjectId(userId) };
    if (action) filter.action = action;

    const logs = await this.logRepo.find({
      filter,
      limit,
      skip,
      sort: { createdAt: -1 } as any,
      populate: [{ path: 'user', select: 'email role' }] as any,
    });

    return (logs as any[]).map(this.mapLog);
  }

  private mapLog(log: any) {
    return {
      id: log._id.toString(),
      action: log.action,
      ipAddress: log.ipAddress,
      user: log.user
        ? {
            id: log.user._id?.toString?.() ?? log.user.toString?.() ?? log.user,
            email: log.user.email,
            role: log.user.role,
          }
        : null,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    };
  }
}
