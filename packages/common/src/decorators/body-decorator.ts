import { BodyParamsMetadata } from '../types';
import { BodyParamsMetadataKey } from '../constants';
export const Body = (propertyName?: string): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (!propertyKey) {
      throw new Error('Decorator propertyKey is undefined, wait ,what?');
    }
    const existingBodyParameters: BodyParamsMetadata = Reflect.getOwnMetadata(BodyParamsMetadataKey, target, propertyKey) || [];
    existingBodyParameters.push({ index: parameterIndex, name: propertyName });
    Reflect.defineMetadata(BodyParamsMetadataKey, existingBodyParameters, target, propertyKey);
  };
};
