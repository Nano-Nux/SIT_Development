import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly register: client.Registry;

  public readonly httpRequestCounter: client.Counter<string>;
  public readonly httpRequestDuration: client.Histogram<string>;

  constructor() {
    this.register = new client.Registry();

    // Add default metrics (memory, CPU, event loop, garbage collection)
    client.collectDefaultMetrics({
      register: this.register,
      prefix: 'sit_backend_',
    });

    // Custom HTTP request counter
    this.httpRequestCounter = new client.Counter({
      name: 'sit_backend_http_requests_total',
      help: 'Total number of HTTP requests processed by the backend',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    // Custom HTTP request duration histogram
    this.httpRequestDuration = new client.Histogram({
      name: 'sit_backend_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.register],
    });
  }

  onModuleInit() {
    // Initialized
  }

  getMetricsContentType(): string {
    return this.register.contentType;
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
