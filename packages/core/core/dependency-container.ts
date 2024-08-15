import 'reflect-metadata';
import { ClassConstructor, InjectionToken, Token } from 'types';

type LifecycleType = 'singleton' | 'transient';

class DependencyError extends Error {
  constructor(message: string, token: Token) {
    if (token instanceof InjectionToken) {
      super(`${message}: ${token.name}`);
    } else {
      super(`${message}: ${token.toString()}`);
    }
  }
}

class CircularDependencyError extends DependencyError {
  constructor(dependency: Token) {
    super(`Circular dependency detected`, dependency);
  }
}

class DependencyResolutionError extends DependencyError {
  constructor(dependency: Token) {
    super(`Failed to resolve dependency`, dependency);
  }
}

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
    if (this.resolving.has(token)) {
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

      const injections = tokens.map((t: ClassConstructor) => {
        const token = Reflect.getMetadata('injectionToken', t);
        return this.resolve(token);
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
