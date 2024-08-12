import { BodyParamsMetadata } from "../types";
import 'reflect-metadata';
export const Body = (propertyName?: string)  => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingBodyParameters: BodyParamsMetadata = Reflect.getOwnMetadata('body_parameters', target, propertyKey) || [];
    existingBodyParameters.push({ index: parameterIndex, name: propertyName });
    Reflect.defineMetadata('body_parameters', existingBodyParameters, target, propertyKey);
  };
};
