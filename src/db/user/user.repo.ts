import { Injectable } from '@nestjs/common';
import { BaseRepo } from '../base.repo';
import { TUser, User } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepo extends BaseRepo<TUser> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUser>,
  ) {
    super(userModel);
  }
}
