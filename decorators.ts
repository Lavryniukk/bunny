import { RequestMethod, RoutesMetadataArray } from './types';
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
  };
};

export const Get = (path: string): MethodDecorator => Route('GET', path);
export const Post = (path: string): MethodDecorator => Route('POST', path);

export const Body = (paramName?: string): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingBodyParameters: Array<{ index: number; name?: string }> =
      Reflect.getOwnMetadata('body_parameters', target, propertyKey) || [];
    existingBodyParameters.push({ index: parameterIndex, name: paramName });
    Reflect.defineMetadata('body_parameters', existingBodyParameters, target, propertyKey);
  };
};
