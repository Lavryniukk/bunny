import { describe, spyOn, expect, beforeEach, test } from 'bun:test';
import 'reflect-metadata';
import { DependencyContainer } from '../src/core/dependency-container';
import { CircularDependencyError, DependencyResolutionError } from '../src/errors';
import {
  Controller,
  Inject,
  Injectable,
  INJECTION_TOKEN_MK,
} from '@bunny-ts/common';

describe('DependencyContainer', () => {
  let dc: DependencyContainer;

  beforeEach(() => {
    dc = new DependencyContainer();
  });

  test('should register and resolve a dependency', () => {
    class TestService {}

    const token = DependencyContainer.createToken('TestService');
    dc.register(token, TestService);

    const instance = dc.resolve(token);

    expect(instance).toBeInstanceOf(TestService);
  });

  test('should resolve singleton dependencies', () => {
    class TestService {}

    const token = DependencyContainer.createToken('TestService');
    dc.register(token, TestService, 'singleton');

    const instance1 = dc.resolve(token);
    const instance2 = dc.resolve(token);

    expect(instance1).toBe(instance2);
  });

  test('should resolve transient dependencies', () => {
    class TestService {}

    const token = DependencyContainer.createToken('TestService');
    dc.register(token, TestService, 'transient');

    const instance1 = dc.resolve(token);
    const instance2 = dc.resolve(token);

    expect(instance1).not.toBe(instance2);
  });

  describe('DependencyContainer', () => {
    let dc: DependencyContainer;

    beforeEach(() => {
      dc = new DependencyContainer();
    });

    test('should inject dependencies', () => {
      @Injectable()
      class DependencyService {}

      @Injectable()
      class TestService {
        constructor(public dependency: DependencyService) {}
      }

      const depToken = Reflect.getMetadata(INJECTION_TOKEN_MK, DependencyService);
      const testToken = Reflect.getMetadata(INJECTION_TOKEN_MK, TestService);

      dc.register(depToken, DependencyService);
      dc.register(testToken, TestService);

      const testService = dc.resolve<TestService>(testToken);

      expect(testService.dependency).toBeInstanceOf(DependencyService);
    });
  });

  test('should throw error when dependency not found', () => {
    const token = DependencyContainer.createToken('NonExistentService');

    expect(() => dc.resolve(token)).toThrowError(DependencyResolutionError);
  });
});
