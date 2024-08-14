import { describe, test, expect, spyOn, beforeEach } from 'bun:test';
import { DependencyContainer } from 'core';
import { Get, Injectable, Post } from 'decorators';
import 'reflect-metadata';
import { Router } from 'router';

describe('Router', () => {
  let di: DependencyContainer;
  let router: Router;
  @Injectable()
  class TestController {
    @Get()
    public getRoute() {
      return 'test';
    }
    @Post()
    public postRoute() {
      return 'test';
    }
    @Get('/:id')
    public getRouteWithParams() {
      return 'test';
    }
  }
  beforeEach(() => {
    di = new DependencyContainer();
    router = new Router(di);
    di.register(TestController);
  });

  describe('getHandler', () => {
    test('should get GET handler', () => {
      router.registerController(TestController);
      const handler = router.getHandler('/test', 'GET');
      expect(handler).toBeDefined();
    });

    test('should get POST handler', () => {
      router.registerController(TestController);
      const handler = router.getHandler('/', 'POST');
      expect(handler).toBeDefined();
    });

    test('should get GET handler with params', () => {
      router.registerController(TestController);
      const handler = router.getHandler('/someUserId', 'GET');
      expect(handler).toBeDefined();
    });

    test('should return undefined if no handler found', () => {
      router.registerController(TestController);
      const handler = router.getHandler('/someUserId', 'POST');
      expect(handler).toBeUndefined();
    });
  });
  describe('registerController', () => {
    test('should register a controller', () => {
      const routerSpy = spyOn(router, 'registerRoute');

      router.registerController(TestController);

      expect(routerSpy).toHaveBeenCalledTimes(3);
      expect(router.routes.get('GET')!.length).toBe(2);
      expect(router.routes.get('POST')!.length).toBe(1);
    });
  });
  describe('matchRoute', () => {
    test('should match route without params', () => {
      const route = '/test';
      const path = '/test';
      const result = router.matchRoute(route, path);
      expect(result).toBeTruthy();
    });

    test('should match route with params', () => {
      const route = '/:id';
      const path = '/someUserId';
      const result = router.matchRoute(route, path);
      expect(result).toBeTruthy();
    });

    test('should not match route with params', () => {
      const route = '/:id';
      const path = '/someUserId/123';
      const result = router.matchRoute(route, path);
      expect(result).toBeFalsy();
    });
  });
});
