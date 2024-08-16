import { INJECTION_TOKEN_MK, INJECT_MK } from '../constants';
import { CircularDependencyError, DependencyResolutionError } from 'errors';
import 'reflect-metadata';
import { ClassConstructor, InjectionToken, Token } from 'types';

type LifecycleType = 'singleton' | 'transient';

export class DependencyContainer {
  private dependencies: Map<Token, any> = new Map();
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
        const injectionToken = Reflect.getMetadata(
          INJECT_MK + i,
          dependency.target
        );
        if (injectionToken) {
          return this.resolve(injectionToken);
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

  registerToken<T>(token: InjectionToken<T>): void {
    if (!this.dependencies.has(token)) {
      this.dependencies.set(token, null);
    }
  }
}
