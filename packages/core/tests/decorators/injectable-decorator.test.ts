import { describe, test, expect } from 'bun:test';
import 'reflect-metadata';
import { Injectable } from 'decorators';
describe('Injectable decorator', () => {
  @Injectable()
  class Tmp {}

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata('injectable', Tmp);

    expect(metadata).toBeTrue();
  });
});
