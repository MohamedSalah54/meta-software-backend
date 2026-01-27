import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepo } from 'src/db/user/user.repo';
import { UpdateMeDto } from './dto/index';
import { hash } from 'src/common/security/hash';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepo) {}

  async getMe(userId: string) {
    if (!userId) throw new BadRequestException('Missing user id');

    const user = await this.userRepo.findOne({
      filter: { _id: new Types.ObjectId(userId) },
      projection: { password: 0 },
    });

    if (!user) throw new NotFoundException('User not found');

    const { _id, email, role } = user as any;
    return { id: _id.toString(), email, role };
  }

  async patchMe(userId: string, dto: UpdateMeDto) {
    if (!userId) throw new BadRequestException('Missing user id');

    const update: any = {};
    if (dto.email) update.email = dto.email.toLowerCase().trim();
    if (dto.password) update.password = hash(dto.password, 10);

    if (!Object.keys(update).length) {
      throw new BadRequestException('No fields to update');
    }

    const updated = await this.userRepo.updateOne({
      filter: { _id: new Types.ObjectId(userId) },
      update: { $set: update },
      options: { projection: { password: 0 } } as any,
    });

    if (!updated) throw new NotFoundException('User not found');

    const { _id, email, role } = updated as any;
    return { id: _id.toString(), email, role };
  }

  async adminGetAll() {
    const users = await this.userRepo.find({
      projection: { password: 0 },
      limit: 100,
      skip: 0,
      sort: { createdAt: -1 } as any,
    });

    return (users as any[]).map((u) => ({
      id: u._id.toString(),
      email: u.email,
      role: u.role,
    }));
  }

  async adminDeleteOne(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    const result = await this.userRepo.deleteOne(new Types.ObjectId(userId));
    if (!result?.deletedCount) throw new NotFoundException('User not found');

    return { id: userId };
  }
}
