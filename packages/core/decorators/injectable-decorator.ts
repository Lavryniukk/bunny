import { DependencyContainer } from 'core';
import { InjectableMetadataKey } from '../constants';
import { ClassConstructor, InjectionToken } from 'types';

export function Injectable() {
  return function (target: ClassConstructor) {
    Reflect.defineMetadata(InjectableMetadataKey, true, target);
    const token = DependencyContainer.createToken(target.name);
    Reflect.defineMetadata('injectionToken', token, target);
  };
}

export function Inject(token: InjectionToken<any>) {
  return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    Reflect.defineMetadata('inject:' + parameterIndex, token, target, propertyKey);
  };
}
