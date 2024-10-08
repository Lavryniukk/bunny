import { Token, InjectionToken } from '@bunny-ts/common';

class DependencyError extends Error {
  constructor(message: string, token: Token) {
    if (token instanceof InjectionToken) {
      super(`${message}: ${token.name}`);
    } else {
      if (!token) {
        super(`Token not found : ${message}`);
      } else {
        super(`${message}: ${token.toString()}`);
      }
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
