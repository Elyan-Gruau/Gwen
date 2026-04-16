import { Example, Get, Route, SuccessResponse, Tags } from 'tsoa';
import { NODE_ENV } from '../../../index';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

@Route('status')
@Tags('Status')
export class StatusController {
  /**
   * Health check endpoint
   */
  @Get('health')
  @SuccessResponse('200', 'Server is healthy')
  @Example<HealthStatus>({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: 123.45,
    environment: 'development',
  })
  public async getHealth(): Promise<HealthStatus> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: NODE_ENV,
    };
  }
}
