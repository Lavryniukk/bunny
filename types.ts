export type RouteHandler = (req: Request) => Response | Promise<Response>;

export type RouteMetadata = {
  method: string;
  path: string;
  handlerName: string;
};

export type RoutesMetadataArray = RouteMetadata[];
