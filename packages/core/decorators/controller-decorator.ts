import { ControllerMetadataKey } from '../constants';
import 'reflect-metadata';
export const Controller = (): ClassDecorator => {
  return function (target: any) {
    Reflect.defineMetadata(ControllerMetadataKey, true, target);
  };
};
