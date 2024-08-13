import { Route } from '@bunnyts/core';
import { describe, test, expect } from 'bun:test';
import 'reflect-metadata';

describe('HttpRouteDecorator', () => {
  class Tmp {
    @Route('GET', '/get')
    getRoute() {}

    @Route('POST', '/post')
    postRoute() {}
  }

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata('routes', Tmp);
    expect(metadata).toEqual([
      { method: 'GET', path: '/get', handlerName: 'getRoute' },
      { method: 'POST', path: '/post', handlerName: 'postRoute' },
    ]);
  });
});
