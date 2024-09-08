import { RequestParameterParser } from '../request';
import { error, json } from '../response';
import {
  ClassConstructor,
  HttpRequestHandler,
  HttpRequestHandlerMethod,
  RouteMetadata,
  RoutesMetadataArray,
  RequestMethod,
  Exception,
  InternalServerErrorException,
  Logger,
  InjectionToken,
} from '@bunny-ts/common';

export class Router {
  routes: Map<RequestMethod, HttpRequestHandler[]> = new Map();

  getHandler(
    requestPath: string,
    method: RequestMethod
  ): HttpRequestHandler | undefined {
    const matchingRoutes = this.routes.get(method) || [];
    return matchingRoutes.find((route) => this.matchRoute(route.path, requestPath));
  }

  registerController(
    controllerInstance: any,
    controllerToken: InjectionToken<any>
  ): void {
    Logger.success(`Registering controller ~ ${controllerToken.name}`);
    const routeMetadata: RoutesMetadataArray =
      Reflect.getMetadata('routes', controllerInstance.constructor) || [];
    const requestParameterParser = new RequestParameterParser(controllerInstance);
    routeMetadata.forEach((rm) =>
      this.registerRoute(
        rm,
        controllerInstance,
        requestParameterParser,
        controllerToken
      )
    );
  }
  registerRoute(
    routeMetadata: RouteMetadata,
    controllerInstance: any,
    requestParameterParser: RequestParameterParser,
    controllerToken: InjectionToken<any>
  ): void {
    const { path, handlerName, method } = routeMetadata;

    const handlerFunction = this.createHandlerFunction(
      controllerInstance,
      handlerName,
      routeMetadata,
      requestParameterParser
    );

    if (!this.routes.has(method)) {
      this.routes.set(method, []);
    }

    const newRoute = {
      method,
      handler: handlerFunction,
      path,
      handlerName,
      controllerToken,
    };
    this.routes.get(method)!.push(newRoute);
    Logger.success(`Registered [${method}] ~ ${path}`);
  }

  createHandlerFunction(
    controller: any,
    handlerName: string,
    routeMetadata: RouteMetadata,
    requestParameterParser: RequestParameterParser
  ): HttpRequestHandlerMethod {
    return async (req: Request) => {
      try {
        const methodParameters = await requestParameterParser.parseRequestParams(
          req,
          routeMetadata
        );
        const result = await controller[handlerName].apply(
          controller,
          methodParameters
        );
        return json(result);
      } catch (e) {
        return this.handleError(e);
      }
    };
  }

  handleError(e: unknown): Response {
    if (Exception.isException(e)) {
      return error(e as Exception);
    } else {
      console.error('Unhandled error:', e);
      return error(new InternalServerErrorException());
    }
  }

  matchRoute(route: string, requestPath: string): boolean {
    const routeChunks = route.split('/');
    const urlChunks = requestPath.split('/');

    if (routeChunks.length !== urlChunks.length) {
      return false;
    }

    return routeChunks.every(
      (routeChunk, i) => routeChunk.startsWith(':') || routeChunk === urlChunks[i]
    );
  }
}
