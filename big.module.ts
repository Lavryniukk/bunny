import { CoreModule, Get, Injectable, Module } from './decorators';
@Injectable()
export class HealthController {
  @Get('/health')
  health() {
    return 'health';
  }
}

@Injectable()
export class CockService {
  cock(): string {
    return 'yes';
  }
}

@Injectable()
export class CockController {
  constructor(private cockService: CockService) {}

  @Get('/cock')
  cocks() {
    return this.cockService.cock();
  }
}
@Module({
  controllers: [HealthController],
})
export class HealthModule {}

@Module({
  controllers: [CockController],
  providers: [CockService],
})
export class CockModule {}

@CoreModule({
  modules: [HealthModule, CockModule],
})
export class CoreAppModule {}
