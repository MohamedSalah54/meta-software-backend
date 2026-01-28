import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { UsersService } from './user.service';
import { UpdateMeDto } from './dto';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { UserRoles } from 'src/common/enum';

@UseGuards(AuthGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const me = await this.usersService.getMe(user.id);
    return { success: true, data: me };
  }

  @Patch('me')
  async patchMe(@CurrentUser() user: any, @Body() dto: UpdateMeDto) {
    const updated = await this.usersService.patchMe(user.id, dto);
    return { success: true, message: 'profile updated', data: updated };
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  async adminGetAll() {
    const users = await this.usersService.adminGetAll();
    return { success: true, data: users };
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async adminDeleteOne(@Param('id') id: string) {
    const deleted = await this.usersService.adminDeleteOne(id);
    return { success: true, message: 'user deleted', data: deleted };
  }
}
