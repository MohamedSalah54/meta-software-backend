import { Injectable } from '@nestjs/common';
import { BaseRepo } from '../base.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, TLog } from './log.model';

@Injectable()
export class LogRepo extends BaseRepo<TLog> {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<TLog>) {
    super(logModel);
  }
}
