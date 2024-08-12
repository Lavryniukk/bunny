import {ParamsMetadata} from '../types'
import 'reflect-metadata';
export const Param = (paramName: string)  => {
  return (target: Object, propertyKey: string | symbol , parameterIndex: number) => {
    const existingParams: ParamsMetadata = Reflect.getOwnMetadata('parameters', target, propertyKey) || [];

    existingParams.push({
      name: paramName,
      index: parameterIndex,
    });

    Reflect.defineMetadata('parameters', existingParams, target, propertyKey);
  };
};
