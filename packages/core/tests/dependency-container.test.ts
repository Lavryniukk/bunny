import { expect, test, describe, beforeEach } from 'bun:test';
import { TestController, TestCoreModule, TestModule, TestService } from './mocks';
import { DependencyContainer } from 'core';
describe('DependencyContainer', () => {
  let di: DependencyContainer;

  beforeEach(() => {
    di = new DependencyContainer();
  });

  test('should be defined', () => {
    expect(di).toBeDefined();
  });
  test('should register a controller', () => {
    di.register(TestController);

    const addedController = di.dependencies.get(TestController.name);

    expect(addedController).toBeInstanceOf(TestController);
    expect(addedController.testControllerMethod).toBeDefined();
    expect(addedController.testService).toBeDefined();
    expect(addedController.testService.testServiceMethod).toBeDefined();
    expect(di.dependencies).not.toBeEmpty();
  });
  test('should register a service', () => {
    di.register(TestService);

    const addedService = di.dependencies.get(TestService.name);

    expect(addedService).toBeInstanceOf(TestService);
    expect(addedService.testServiceMethod).toBeDefined();
    expect(di.dependencies).not.toBeEmpty();
  });
  test('should resolve controller', () => {
    di.register(TestController);

    const resolved = di.resolve(TestController);

    expect(resolved).toBeInstanceOf(TestController);
    expect(resolved.testControllerMethod).toBeDefined();
    expect(resolved.testService).toBeDefined();
    expect(resolved.testService.testServiceMethod).toBeDefined();
  });
});
