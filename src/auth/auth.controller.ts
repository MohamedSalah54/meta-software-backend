import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log('REGISTER DTO:', dto);

    const user = await this.authService.register(dto);
    return {
      success: true,
      message: 'user created successfully',
      data: user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.login(dto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });
    return {
      success: true,
      message: 'logged in successfully',
      accessToken,
      data: user,
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@CurrentUser() user) {
    return {
      success: true,
      user: user,
    };
  }
}
