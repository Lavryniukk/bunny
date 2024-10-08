import { RequestMethod, RoutesMetadataArray } from '../types';

export const Route = (method: string, path: string): MethodDecorator => {
  return (target: any, propertyKey: string | symbol, _) => {
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

export const Get = (path?: string): MethodDecorator => Route('GET', path || '/');
export const Post = (path?: string): MethodDecorator => Route('POST', path || '/');
export const Put = (path?: string): MethodDecorator => Route('PUT', path || '/');
export const Patch = (path?: string): MethodDecorator => Route('PATCH', path || '/');
export const Delete = (path?: string): MethodDecorator => Route('DELETE', path || '/');
