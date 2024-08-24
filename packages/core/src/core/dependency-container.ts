import {
  Token,
  ClassConstructor,
  INJECT_MK,
  INJECTION_TOKEN_MK,
  InjectionToken,
} from '@bunny-ts/common';
import { CircularDependencyError, DependencyResolutionError } from 'errors';
import 'reflect-metadata';

type LifecycleType = 'singleton' | 'transient';

export class DependencyContainer {
  private dependencies: Map<
    Token,
    { target: ClassConstructor; lifecycle: LifecycleType; instance: any | null }
  > = new Map();
  private resolving: Set<Token> = new Set();

  register<T>(
    token: Token,
    target: ClassConstructor<T>,
    lifecycle: LifecycleType = 'singleton'
  ): void {
    if (!token || !target) {
      throw new Error('Invalid registration: token and target must be provided');
    }
    this.dependencies.set(token, { target, lifecycle, instance: null });
  }

  resolve<T>(token: Token): T {
    const isAlreadyResolving = this.resolving.has(token);
    if (isAlreadyResolving) {
      throw new CircularDependencyError(token);
    }
    let dependency = this.dependencies.get(token);
    if (!dependency) {
      console.log('Could not find dependency for token', token);
      console.log('Dependencies', this.dependencies);
      throw new DependencyResolutionError(token);
    }
    if (dependency.lifecycle === 'singleton' && dependency.instance) {
      return dependency.instance;
    }

    this.resolving.add(token);

    try {
      const tokens =
        Reflect.getMetadata('design:paramtypes', dependency.target) || [];
      const injections = tokens.map((t: Token, i: number) => {
        const injectToken = Reflect.getMetadata(INJECT_MK + i, dependency.target);
        if (injectToken) {
          return this.resolve(injectToken);
        }
        const token = Reflect.getMetadata(INJECTION_TOKEN_MK, t);
        if (token) {
          return this.resolve(token);
        }
      });

      const instance = new dependency.target(...injections);

      if (dependency.lifecycle === 'singleton') {
        dependency.instance = instance;
      }

      return instance;
    } finally {
      this.resolving.delete(token);
    }
  }

  static createToken<T>(name: string): InjectionToken<T> {
    return new InjectionToken<T>(name);
  }
}
