import { Bunny } from '.';
import { Body, Get, Param, Post } from './decorators';
class HealthService {
  @Post('/')
  async check(@Body() cockcer: any) {
    console.log('Got request: ', cockcer);

    return { status: 'ok' };
  }
  @Get('/cck')
  async bg(@Body() db, @Param('id') param) {
    return { status: 'this is fixed route' };
  }
  @Get('/:id')
  async status(@Param('id') param: string) {
    return { status: `dynamic with ${param}` };
  }
}

const healthService = new HealthService();

const bunny = new Bunny();

bunny.addService(healthService);

bunny.listen(8000);
