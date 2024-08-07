import 'reflect-metadata';
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
      const bodyParameters: { index: number; name?: string }[] =
        Reflect.getOwnMetadata('body_parameters', service.constructor.prototype, handlerName) || [];

      let body: any;
      if (bodyParameters.length > 0) {
        try {
          body = await req.json();
        } catch (error) {
          console.error('Failed to parse request body:', error);
          return json({ error: 'Invalid request body' }, { status: 400 });
        }
      }

      const methodParameters: any[] = [];

      bodyParameters.forEach(({ index, name }) => {
        methodParameters[index] = name ? body[name] : body;
      });

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
