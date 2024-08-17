import { Token, InjectionToken } from '../types';

class DependencyError extends Error {
  constructor(message: string, token: Token) {
    if (token instanceof InjectionToken) {
      super(`${message}: ${token.name}`);
    } else {
      super(`${message}: ${token.toString()}`);
    }
  }
}

export class CircularDependencyError extends DependencyError {
  constructor(dependency: Token) {
    super(`Circular dependency detected`, dependency);
  }
}

export class DependencyResolutionError extends DependencyError {
  constructor(dependency: Token) {
    super(`Failed to resolve dependency`, dependency);
  }
}
