import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // Skip tracking for the metrics endpoint itself
    if (req.originalUrl?.includes('/api/metrics') || req.url?.includes('/metrics')) {
      return next.handle();
    }

    const startTime = process.hrtime();
    const method = req.method;

    return next.handle().pipe(
      tap({
        next: () => {
          this.record(startTime, method, req, res.statusCode || 200);
        },
        error: (err) => {
          const status = err.status || err.statusCode || 500;
          this.record(startTime, method, req, status);
        },
      }),
    );
  }

  private record(startTime: [number, number], method: string, req: any, statusCode: number) {
    const diff = process.hrtime(startTime);
    const durationSeconds = diff[0] + diff[1] / 1e9;
    const route = req.route?.path || req.baseUrl || req.path || 'unknown';

    this.metricsService.httpRequestCounter.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });

    this.metricsService.httpRequestDuration.observe(
      {
        method,
        route,
        status_code: statusCode.toString(),
      },
      durationSeconds,
    );
  }
}
