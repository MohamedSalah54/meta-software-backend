import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';


import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRoles } from 'src/common/enum';
import { LogsService } from './log.service';
import { LogsQueryDto } from './dto';
import { RoleGuard } from 'src/common/guards/roles.guard';

@UseGuards(AuthGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}



  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get()
  async allLogs(@Query() query: LogsQueryDto) {
    const logs = await this.logsService.getAllLogs(query);
    return { success: true, data: logs };
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRoles.ADMIN)
  @Get('user/:userId')
  async oneUserLogs(@Param('userId') userId: string, @Query() query: LogsQueryDto) {
    const logs = await this.logsService.getUserLogs(userId, query);
    return { success: true, data: logs };
  }
}
