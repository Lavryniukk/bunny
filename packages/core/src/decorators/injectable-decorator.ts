import { DependencyContainer } from '../core';
import { INJECT_MK, INJECTION_TOKEN_MK } from '../constants';
import { ClassConstructor, Token } from '../types';
import 'reflect-metadata';
export function Injectable() {
  return function (target: ClassConstructor) {
    const token = DependencyContainer.createToken(target.name);
    Reflect.defineMetadata(INJECTION_TOKEN_MK, token, target);
  };
}

export function Inject(token: Token) {
  return function (target: Object, _: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(INJECT_MK + parameterIndex, token, target);
  };
}
