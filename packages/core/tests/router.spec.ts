import { describe, expect, beforeEach, test } from 'bun:test';
import { Router } from '../src/router';
import { Controller, Get, Post, InjectionToken, Param } from '@bunny-ts/common';

describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
  });

  test('should register a route and retrieve handler', () => {
    @Controller()
    class TestController {
      @Get('/test')
      testMethod() {
        return 'test';
      }
    }

    const controllerToken = new InjectionToken('TestController');
    const controllerInstance = new TestController();

    router.registerController(controllerInstance, controllerToken);

    const handler = router.getHandler('/test', 'GET');

    expect(handler).toBeDefined();
    expect(handler!.path).toBe('/test');
    expect(handler!.method).toBe('GET');
  });

  test('should match route with parameters', () => {
    @Controller()
    class TestController {
      @Get('/users/:id')
      getUser(id: string) {
        return { id };
      }
    }

    const controllerToken = new InjectionToken('TestController');
    const controllerInstance = new TestController();

    router.registerController(controllerInstance, controllerToken);

    const handler = router.getHandler('/users/123', 'GET');

    expect(handler).toBeDefined();
    expect(router.matchRoute(handler!.path, '/users/123')).toBe(true);
  });

  test('should not match route with different method', () => {
    @Controller()
    class TestController {
      @Post('/submit')
      submitData() {
        return 'submitted';
      }
    }

    const controllerToken = new InjectionToken('TestController');
    const controllerInstance = new TestController();

    router.registerController(controllerInstance, controllerToken);

    const handler = router.getHandler('/submit', 'GET');

    expect(handler).toBeUndefined();
  });

  test('should handle route with multiple parameters', () => {
    @Controller()
    class TestController {
      @Get('/users/:userId/posts/:postId')
      getUserPost(
        @Param('userId') userId: string,
        @Param('postId') postId: string
      ) {
        return { userId, postId };
      }
    }

    const controllerToken = new InjectionToken('TestController');
    const controllerInstance = new TestController();

    router.registerController(controllerInstance, controllerToken);

    const handler = router.getHandler('/users/42/posts/100', 'GET');

    expect(handler).toBeDefined();
    expect(router.matchRoute(handler!.path, '/users/42/posts/100')).toBe(true);
  });
});
