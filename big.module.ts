import { Body, Get, Injectable, Module, Param, Post } from './decorators';
@Injectable()
export class HealthController {
  @Post('/')
  async check(@Body() cockcer: any) {
    console.log('Got request: ', cockcer);

    return { status: 'ok' };
  }
  @Get('/cck')
  async bg(@Body() db, @Param('id') param) {
    throw new Error('goi');
  }
  @Get('/:id')
  async status(@Param('id') param: string) {
    return { status: `dynamic with ${param}` };
  }
}

@Module({
  controllers: [HealthController],
})
export class AppModule {
  @Get('/health')
  health() {
    return 'health';
  }
}
