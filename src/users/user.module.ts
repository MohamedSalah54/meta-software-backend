import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';



import { User, UserSchema } from 'src/db/user/user.model';
import { UserRepo } from 'src/db/user/user.repo';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepo],
  exports: [UsersService],
})
export class UsersModule {}
