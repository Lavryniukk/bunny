// ~~~~~~~~~~~~~~~REQUEST TYPES~~~~~~~~~~~~~~~~

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HttpRequestHandler = {
  method: RequestMethod;
  handler: HttpRequestHandlerMethod;
  path: string;
};

export type HttpRequestHandlerMethod = (req: Request) => Response | Promise<Response>;

export type BunnyRequestParams = {
  body: any;
  params: Record<string, string>;
};

// ~~~~~~~~~~~~~~~CLASS METADATA TYPES~~~~~~~~~~~~~~~~

export type RouteMetadata = {
  method: RequestMethod;
  path: string;
  handlerName: string;
};
export type RoutesMetadataArray = RouteMetadata[];

export type BodyParamsMetadata = { index: number; name?: string }[];
export type ParamsMetadata = { index: number; name: string }[];
