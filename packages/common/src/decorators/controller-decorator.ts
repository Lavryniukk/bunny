import { INJECTION_TOKEN_MK } from '../constants';
import { InjectionToken } from '../types';
export const Controller = (): ClassDecorator => {
  return function (target: any) {
    const token: InjectionToken<any> = new InjectionToken<any>(target.name);
    Reflect.defineMetadata(INJECTION_TOKEN_MK, token, target);
  };
};
