import { RoutesMetadataArray } from "./types";

export const Route = (method: string, path: string): MethodDecorator => {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    // Check if the routes metadata exists on the target
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      // If it doesn't, create it
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes: RoutesMetadataArray = Reflect.getMetadata(
      "routes",
      target.constructor
    );
    // Add the route to the metadata
    routes.push({
      method,
      path,
      handlerName: propertyKey as string,
    });
    //
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};

export const Get = (path: string): MethodDecorator => Route("GET", path);
export const Post = (path: string): MethodDecorator => Route("POST", path);
