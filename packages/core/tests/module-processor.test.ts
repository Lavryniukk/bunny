import { spyOn, beforeEach, describe, test, expect, mock } from 'bun:test';
import { TestCoreModule, TestModule } from './mocks';
import { ModuleProcessor, DependencyContainer } from 'core';
import { Router } from 'router';
describe('ModuleProcessor', () => {
  let mp: ModuleProcessor;
  let di: DependencyContainer;
  let router: Router;
  beforeEach(() => {
    di = new DependencyContainer();
    router = new Router(di);
    mp = new ModuleProcessor(di, router);
  });
  test('should be defined', () => {
    expect(mp).toBeDefined();
    expect(di).toBeDefined();
    expect(router).toBeDefined();
  });
  test('should proccess a module', () => {
    const routerSpy = spyOn(router, 'registerController');
    const diSpy = spyOn(di, 'register');

    mp.processModule(TestModule);
    expect(diSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledTimes(1);
    mock.restore();
  });

  test('should proccess a coremodule', () => {
    const routerSpy = spyOn(router, 'registerController');
    const diSpy = spyOn(di, 'register');
    const mpSpy = spyOn(mp, 'processModule');

    mp.processCoreModule(TestCoreModule);

    expect(mpSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalled();
    expect(diSpy).toHaveBeenCalled();
    mock.restore();
  });
});
