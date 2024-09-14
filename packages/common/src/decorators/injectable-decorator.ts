import { INJECT_MK, INJECTION_TOKEN_MK } from '../constants';
import { InjectionToken, Token } from '../types';
export function Injectable(): ClassDecorator {
  return function (target) {
    const token = new InjectionToken<any>(target.name);
    Reflect.defineMetadata(INJECTION_TOKEN_MK, token, target);
  };
}

export function Inject(token: Token): ParameterDecorator {
  return function (target: Object, _, parameterIndex: number) {
    Reflect.defineMetadata(INJECT_MK + parameterIndex, token, target);
  };
}
