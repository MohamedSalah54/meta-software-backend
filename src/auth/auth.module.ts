import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthController } from './auth.controller';
import { User, UserSchema } from 'src/db/user/user.model';
import { AuthService } from './auth.service';
import { TokenService } from 'src/common/security/token.service';
import { UserRepo } from 'src/db/user/user.repo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET as string,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, AuthGuard, UserRepo],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
