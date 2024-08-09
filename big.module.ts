import { CoreModule, Get, Injectable, Module } from './decorators';
@Injectable()
export class HealthController {
  @Get('/health')
  health() {
    return 'health';
  }
}

@Injectable()
export class CockController {
  @Get('/cock')
  cock() {
    return 'cock';
  }
}
@Module({
  controllers: [HealthController],
})
export class HealthModule {}

@Module({
  controllers: [CockController],
})
export class CockModule {}

@CoreModule({
  modules: [HealthModule, CockModule],
})
export class CoreAppModule {}
