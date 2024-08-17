import { DependencyContainer } from 'core';
import { ControllerMetadataKey, INJECTION_TOKEN_MK } from '../constants';
import 'reflect-metadata';
export const Controller = (): ClassDecorator => {
  return function (target: any) {
    const token = DependencyContainer.createToken(target.name);
    Reflect.defineMetadata(INJECTION_TOKEN_MK, token, target);
  };
};
