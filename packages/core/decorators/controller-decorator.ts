import { DependencyContainer } from 'core';
import { ControllerMetadataKey } from '../constants';
import 'reflect-metadata';
export const Controller = (): ClassDecorator => {
  return function (target: any) {
    Reflect.defineMetadata(ControllerMetadataKey, true, target);
    const token = DependencyContainer.createToken(target.name);
    Reflect.defineMetadata('injectionToken', token, target);
  };
};
