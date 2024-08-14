import { describe, test, expect } from 'bun:test';
import 'reflect-metadata';
import { Injectable } from 'decorators';
import { InjectableMetadataKey } from '../../constants';
describe('Injectable decorator', () => {
  @Injectable()
  class Tmp {}

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata(InjectableMetadataKey, Tmp);

    expect(metadata).toBeTrue();
  });
});
