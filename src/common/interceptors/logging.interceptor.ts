import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogsService } from 'src/log/log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(async () => {
        const user = req.user;
        const action = `${req.method} ${req.originalUrl}`;

        await this.logsService.create({
          action,
          user: user?.id,
          ipAddress: req.ip,
        });
      }),
    );
  }
}
