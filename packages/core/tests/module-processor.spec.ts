import { describe, expect, beforeEach, test } from 'bun:test';
import { DependencyContainer } from '../src/core/dependency-container';
import { Router } from '../src/router';
import { ModuleProcessor } from '../src/core/module-processor';
import { Module, Controller, Injectable, Get, CoreModule } from '@bunny-ts/common';
import { InjectionToken } from '@bunny-ts/common';

describe('ModuleProcessor', () => {
  let container: DependencyContainer;
  let router: Router;
  let processor: ModuleProcessor;

  beforeEach(() => {
    container = new DependencyContainer();
    router = new Router();
    processor = new ModuleProcessor(container, router);
  });

  test('should process a module and register providers and controllers', () => {
    @Injectable()
    class TestService {
      getMessage() {
        return 'Hello from TestService';
      }
    }

    @Controller()
    class TestController {
      constructor(private readonly service: TestService) {}

      @Get('/test')
      testMethod() {
        return this.service.getMessage();
      }
    }

    @Module({
      controllers: [TestController],
      providers: [TestService],
    })
    class TestModule {}

    processor.processModule(TestModule);

    const controllerToken = processor.getInjectionMetadata(TestController);
    const serviceToken = processor.getInjectionMetadata(TestService);

    expect(container._dependencies.has(serviceToken)).toBe(true);

    expect(container._dependencies.has(controllerToken)).toBe(true);

    const handler = router.getHandler('/test', 'GET');
    expect(handler).toBeDefined();
    expect(handler!.controllerToken).toBe(controllerToken);
  });

  test('should process core module with nested modules', () => {
    @Injectable()
    class NestedService {
      getMessage() {
        return 'Hello from NestedService';
      }
    }

    @Controller()
    class NestedController {
      constructor(private readonly service: NestedService) {}

      @Get('/nested')
      nestedMethod() {
        return this.service.getMessage();
      }
    }

    @Module({
      controllers: [NestedController],
      providers: [NestedService],
    })
    class NestedModule {}

    @CoreModule({
      modules: [NestedModule],
    })
    class AppModule {}

    processor.processCoreModule(AppModule);

    const controllerToken = processor.getInjectionMetadata(NestedController);
    const serviceToken = processor.getInjectionMetadata(NestedService);

    expect(container._dependencies.has(serviceToken)).toBe(true);

    expect(container._dependencies.has(controllerToken)).toBe(true);

    const handler = router.getHandler('/nested', 'GET');
    expect(handler).toBeDefined();
    expect(handler!.controllerToken).toBe(controllerToken);
  });

  test('should get injection metadata', () => {
    @Injectable()
    class TestService {}

    const token = processor.getInjectionMetadata(TestService);

    expect(token).toBeInstanceOf(InjectionToken);
    expect(token.name).toBe('TestService');
  });
});
