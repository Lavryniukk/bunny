export type RouteHandler = (req: Request) => any;

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HttpRequestHandler = {
  method: RequestMethod;
  handler: (req: Request) => Response | Promise<Response>;
  path: string;
};

export type RouteMetadata = {
  method: RequestMethod;
  path: string;
  handlerName: string;
};

export type RoutesMetadataArray = RouteMetadata[];

export type BunnyRequestParams = {
  body: any;
  params: Record<string, string>;
};
