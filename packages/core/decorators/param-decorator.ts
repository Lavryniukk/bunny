import { QueryParamsMetadataKey } from '../constants';
import { ParamsMetadata } from '../types';
import 'reflect-metadata';
export const Param = (paramName: string) => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingParams: ParamsMetadata = Reflect.getOwnMetadata(QueryParamsMetadataKey, target, propertyKey) || [];

    existingParams.push({
      name: paramName,
      index: parameterIndex,
    });

    Reflect.defineMetadata(QueryParamsMetadataKey, existingParams, target, propertyKey);
  };
};
