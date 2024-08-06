import "reflect-metadata";
import { RouteHandler, RoutesMetadataArray } from "./types";

export class Router {
  private routes: Map<string, RouteHandler> = new Map();

  addRoute(path: string, handler: RouteHandler) {
    this.routes.set(path, handler);
  }

  getHandler(path: string): RouteHandler | undefined {
    return this.routes.get(path);
  }

  addService(service: any) {
    // Get the routes metadata from the service
    const routes: RoutesMetadataArray = Reflect.getMetadata(
      "routes",
      service.constructor
    );

    if (!routes) {
      return;
    }

    routes.forEach((route) => {
      // Add the RouteHandler to the router
      const handler: RouteHandler = service[route.handlerName].bind(service);
      this.addRoute(route.path, handler);
    });
  }
}
