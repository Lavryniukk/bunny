import 'reflect-metadata';
import { DependencyContainer } from '../core';
import { Exception, InternalServerErrorException } from '../exceptions';
import { RequestParameterParser } from '../request';
import { error, json } from '../response';
import {
  ClassConstructor,
  HttpRequestHandler,
  HttpRequestHandlerMethod,
  RouteMetadata,
  RoutesMetadataArray,
  RequestMethod,
} from '../types';

export class Router {
  routes: Map<RequestMethod, HttpRequestHandler[]> = new Map();
  private readonly container: DependencyContainer;

  constructor(container: DependencyContainer) {
    this.container = container;
  }

  getHandler(requestPath: string, method: RequestMethod): HttpRequestHandlerMethod | undefined {
    const matchingRoutes = this.routes.get(method) || [];
    return matchingRoutes.find((route) => this.matchRoute(route.path, requestPath))?.handler;
  }

  registerController(ControllerClass: ClassConstructor): void {
    const controller = this.container.resolve(ControllerClass);
    const routeMetadata: RoutesMetadataArray = Reflect.getMetadata('routes', ControllerClass) || [];
    const requestParameterParser = new RequestParameterParser(controller);

    routeMetadata.forEach((rm) => this.registerRoute(rm, controller, requestParameterParser));
  }

  registerRoute(routeMetadata: RouteMetadata, controller: any, requestParameterParser: RequestParameterParser): void {
    const { path, handlerName, method } = routeMetadata;

    const handlerFunction = this.createHandlerFunction(controller, handlerName, routeMetadata, requestParameterParser);

    if (!this.routes.has(method)) {
      this.routes.set(method, []);
    }
    this.routes.get(method)!.push({ method, handler: handlerFunction, path });
  }

  createHandlerFunction(
    controller: any,
    handlerName: string,
    routeMetadata: RouteMetadata,
    requestParameterParser: RequestParameterParser
  ): HttpRequestHandlerMethod {
    return async (req: Request) => {
      try {
        const methodParameters = await requestParameterParser.parseRequestParams(req, routeMetadata);
        const result = await controller[handlerName].apply(controller, methodParameters);
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

    return routeChunks.every((routeChunk, i) => routeChunk.startsWith(':') || routeChunk === urlChunks[i]);
  }
}
