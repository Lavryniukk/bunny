import { INJECT_MK, INJECTION_TOKEN_MK } from '../constants';
import { ClassConstructor, InjectionToken, Token } from '../types';
export function Injectable() {
  return function (target: ClassConstructor) {
    const token = new InjectionToken<any>(target.name);
    Reflect.defineMetadata(INJECTION_TOKEN_MK, token, target);
  };
}

export function Inject(token: Token) {
  return function (target: Object, _: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata(INJECT_MK + parameterIndex, token, target);
  };
}
