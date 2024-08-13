import { describe, test, expect } from 'bun:test';
import { Module } from '../../decorators';
describe('Module Decorator', () => {
  @Module({
    providers: [],
    controllers: [],
  })
  class Tmp {}
  test('should have metadata', () => {
    const metadata = Reflect.getMetadata('module:metadata', Tmp);
    expect(metadata).toEqual({ providers: [], controllers: [] });
  });
});
