import { describe, test, expect } from 'bun:test';
import { Module } from '../../decorators';
import { ModuleMetadataKey } from '../../constants';
describe('Module Decorator', () => {
  @Module({
    providers: [],
    controllers: [],
  })
  class Tmp {}
  test('should have metadata', () => {
    const metadata = Reflect.getMetadata(ModuleMetadataKey, Tmp);
    expect(metadata).toEqual({ providers: [], controllers: [] });
  });
});
