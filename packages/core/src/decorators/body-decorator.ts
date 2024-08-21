import { BodyParamsMetadata } from '../types';
import 'reflect-metadata';
import { BodyParamsMetadataKey } from '../constants';
export const Body = (propertyName?: string) => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingBodyParameters: BodyParamsMetadata =
      Reflect.getOwnMetadata(BodyParamsMetadataKey, target, propertyKey) || [];
    existingBodyParameters.push({ index: parameterIndex, name: propertyName });
    Reflect.defineMetadata(
      BodyParamsMetadataKey,
      existingBodyParameters,
      target,
      propertyKey
    );
  };
};
