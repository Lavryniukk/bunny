import 'reflect-metadata';
import { parseRequestParams } from '../request';
import { json } from '../response';
import { HttpRequestHandler, RouteMetadata, RoutesMetadataArray } from '../types';

export class Router {
  private routes: HttpRequestHandler[] = [];

  addRoute(handler: HttpRequestHandler) {
    this.routes.push(handler);
  }

  registerRoute(routeMetadata: RouteMetadata, service: any) {
    const { path, handlerName, method } = routeMetadata;

    const handlerFunction = async (req: Request) => {
      const methodParameters = await parseRequestParams(req, routeMetadata, service);
      const result = await service[handlerName].apply(service, methodParameters);
      return json(result);
    };

    const handler: HttpRequestHandler = {
      method: method,
      handler: handlerFunction,
      path: path,
    };
    this.routes.push(handler);
  }

  getHandler(path: string, method: string): HttpRequestHandler | undefined {
    return this.routes.find((route) => route.path === path && route.method === method);
  }

  addService(service: any) {
    const routeMetadataArray: RoutesMetadataArray = Reflect.getMetadata('routes', service.constructor);

    if (!routeMetadataArray) {
      return;
    }

    routeMetadataArray.forEach((r) => this.registerRoute(r, service));
  }
}
