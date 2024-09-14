import { QueryParamsMetadataKey } from '../constants';
import { ParamsMetadata } from '../types';
export const Param = (paramName: string): ParameterDecorator => {
  return (target: Object, propertyKey, parameterIndex: number) => {
    if (!propertyKey) {
      throw Error('Decorator without propertyKey, wait, what?');
    }
    const existingParams: ParamsMetadata = Reflect.getOwnMetadata(QueryParamsMetadataKey, target, propertyKey) || [];

    existingParams.push({
      name: paramName,
      index: parameterIndex,
    });

    Reflect.defineMetadata(QueryParamsMetadataKey, existingParams, target, propertyKey);
  };
};
