import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/security/token.service';
import { UserRepo } from 'src/db/user/user.repo';
import { LoginDto, RegisterDto } from './dto';
import { compare, hash } from 'src/common/security/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto?.email?.toLowerCase().trim();
    const password = dto?.password;

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const exists = await this.userRepo.findOne({
      filter: { email },
      projection: { _id: 1 },
    });

    if (exists) throw new ConflictException('Email already in use');

    const created = await this.userRepo.create({
      email,
      password: hash(password, 10),
    } as any);

    return {
      id: created._id.toString(),
      email: created.email,
      role: created.role,
    };
  }

  async login(dto: LoginDto) {
    const email = dto?.email?.toLowerCase().trim();
    const password = dto?.password;

    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    const user = await this.userRepo.findOne({
      filter: { email },
      projection: { password: 1, email: 1, role: 1 },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const { _id, email: uEmail, role } = user;

    const accessToken = this.tokenService.signAccessToken({
      id: _id.toString(),
      email: uEmail,
      role,
    });

    return {
      accessToken,
      user: {
        id: _id.toString(),
        email: uEmail,
        role,
      },
    };
  }

  async me(userId: string) {
    if (!userId) throw new BadRequestException('Missing user id');

    const user = await this.userRepo.findOne({
      filter: { _id: userId } as any,
      projection: { password: 0 },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const { _id, email, role } = user;
    return { id: _id.toString(), email, role };
  }
}
