import { Bunny } from '.';
import { Body, Get, Post } from './decorators';
class HealthService {
  @Post('/')
  async check(@Body() cockcer: any) {
    console.log('Got request: ', cockcer);

    return { status: 'ok' };
  }

  @Get('/')
  status(@Body() req) {
    console.table(req);
    return { status: req };
  }
}

const healthService = new HealthService();

const bunny = new Bunny();

bunny.addService(healthService);

bunny.listen(8000);
