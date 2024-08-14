import { InjectableMetadataKey } from '../constants';
import 'reflect-metadata';
export const Injectable = (): ClassDecorator => {
  return function (target: any) {
    Reflect.defineMetadata(InjectableMetadataKey, true, target);
  };
};
