import 'reflect-metadata';
import { parseRequestParams } from '../request';
import { json } from '../response';
import { HttpRequestHandler, HttpRequestHandlerMethod, RouteMetadata, RoutesMetadataArray } from '../types';

export class Router {
  private routes: HttpRequestHandler[] = [];

  registerRoute(routeMetadata: RouteMetadata, service: any) {
    const { path, handlerName, method } = routeMetadata;

    const handlerFunction = async (req: Request) => {
      const methodParameters = await parseRequestParams(req, routeMetadata, service);
      const result = await service[handlerName].apply(service, methodParameters);
      return json(result);
    };

    this.routes.push({
      method: method,
      handler: handlerFunction,
      path: path,
    });
  }

  addService(service: any) {
    const routeMetadataArray: RoutesMetadataArray = Reflect.getMetadata('routes', service.constructor);

    if (!routeMetadataArray) {
      return;
    }

    routeMetadataArray.forEach((r) => this.registerRoute(r, service));
  }

  getDynamicHandler(requestPath: string, method: string): HttpRequestHandlerMethod | undefined {
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
