import { Bunny } from '@bunnyts/core';
import { test, expect, beforeEach, describe } from 'bun:test';
import { TestCoreModule } from './mocks';
describe('Bunny', () => {
  let bunny: Bunny;
  beforeEach(() => {
    bunny = new Bunny(TestCoreModule);
  });

  test('should be defined', () => {
    expect(bunny).toBeDefined();
  });
});
