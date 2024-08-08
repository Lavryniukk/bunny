import { BodyParamsMetadata, ParamsMetadata, RequestMethod, RoutesMetadataArray } from '../types';
export const Route = (method: string, path: string): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    if (!Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor);
    }
    const routes: RoutesMetadataArray = Reflect.getMetadata('routes', target.constructor);
    const methodd = method.toUpperCase() as RequestMethod;
    routes.push({
      method: methodd,
      path,
      handlerName: propertyKey as string,
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
    //THINK - prohibit the same routes?
  };
};

export const Get = (path: string): MethodDecorator => Route('GET', path);
export const Post = (path: string): MethodDecorator => Route('POST', path);

export const Body = (propertyName?: string): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingBodyParameters: BodyParamsMetadata = Reflect.getOwnMetadata('body_parameters', target, propertyKey) || [];
    existingBodyParameters.push({ index: parameterIndex, name: propertyName });
    Reflect.defineMetadata('body_parameters', existingBodyParameters, target, propertyKey);
  };
};

export const Param = (paramName: string): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    const existingParams: ParamsMetadata = Reflect.getOwnMetadata('parameters', target, propertyKey) || [];

    existingParams.push({
      name: paramName,
      index: parameterIndex,
    });

    Reflect.defineMetadata('parameters', existingParams, target, propertyKey);
  };
};
