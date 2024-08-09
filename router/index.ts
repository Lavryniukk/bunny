import 'reflect-metadata';
import { Constructor, DependencyContainer } from '../core';
import { Exception, InternalServerErrorException } from '../errors';
import { parseRequestParams } from '../request';
import { error, json } from '../response';
import { HttpRequestHandlerMethod, RouteMetadata, RoutesMetadataArray } from '../types';

export class Router {
  private routes: Array<{
    method: string;
    path: string;
    handler: (req: Request) => Promise<Response>;
  }> = [];
  private container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this.container = container;
  }

  registerController(ControllerClass: Constructor) {
    const controller = this.container.resolve(ControllerClass);
    const routeMetadata: RoutesMetadataArray = Reflect.getMetadata('routes', ControllerClass) || [];
    console.log(routeMetadata);
    routeMetadata.forEach((rm) => {
      this.registerRoute(rm, controller);
    });
  }
  registerRoute(routeMetadata: RouteMetadata, service: any) {
    const { path, handlerName, method } = routeMetadata;
    console.log(routeMetadata);
    const handlerFunction = async (req: Request) => {
      const methodParameters = await parseRequestParams(req, routeMetadata, service);
      try {
        const result = await service[handlerName].apply(service, methodParameters);
        return json(result);
      } catch (e) {
        if (Exception.isException(e)) {
          return error(e);
        } else {
          console.log(e);
          //TODO - this can be logged as error
          return error(new InternalServerErrorException());
        }
      }
    };
    this.routes.push({
      method: method,
      handler: handlerFunction,
      path: path,
    });
  }
  getHandler(requestPath: string, method: string): HttpRequestHandlerMethod | undefined {
    const matchingRoutes = this.routes.filter((route) => route.method === method);
    return matchingRoutes.find((route) => matchRoute(route.path, requestPath))?.handler;
  }
}

function matchRoute(route: string, requestPath: string): boolean {
  const routeChunks = route.split('/');
  const urlChunks = requestPath.split('/');
  if (routeChunks.length !== urlChunks.length) {
    return false;
  }
  for (let i = 0; i < routeChunks.length; i++) {
    const routeChunk = routeChunks[i];
    const urlChunk = urlChunks[i];
    if (routeChunk.startsWith(':')) {
      continue;
    }
    if (routeChunk !== urlChunk) {
      return false;
    }
  }
  return true;
}
