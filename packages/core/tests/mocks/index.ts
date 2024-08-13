import { Injectable, Get, Module, CoreModule } from 'decorators';

@Injectable()
export class TestService {
  testServiceMethod() {
    return 'service response';
  }
}

@Injectable()
export class TestController {
  constructor(readonly testService: TestService) {}
  @Get('/')
  testControllerMethod() {
    return this.testService.testServiceMethod();
  }
}

@Module({ controllers: [TestController] })
export class TestModule {}

@CoreModule({ modules: [TestModule] })
export class TestCoreModule {}
