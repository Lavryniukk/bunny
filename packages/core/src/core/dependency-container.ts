import {
  Token,
  ClassConstructor,
  INJECT_MK,
  INJECTION_TOKEN_MK,
  InjectionToken,
} from '@bunny-ts/common';
import { CircularDependencyError, DependencyResolutionError } from 'errors';

type LifecycleType = 'singleton' | 'transient';
export type Dependency = {
  target: ClassConstructor;
  lifecycle: LifecycleType;
  instance: any | null;
};

export class DependencyContainer {
  private dependencies: Map<Token, Dependency> = new Map();
  private resolving: Set<Token> = new Set();

  register<T>(
    token: Token,
    target: ClassConstructor<T>,
    lifecycle: LifecycleType = 'singleton'
  ): void {
    if (!token || !target) {
      throw new Error('Invalid registration: token and target must be provided');
    }
    const dep = { target, lifecycle, instance: null };
    this.dependencies.set(token, dep);
  }

  resolve<T>(token: Token): T {
    const isAlreadyResolving = this.resolving.has(token);
    if (isAlreadyResolving) {
      throw new CircularDependencyError(token);
    }
    let dependency = this.dependencies.get(token);
    if (!dependency) {
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
