// ~~~~~~~~~~~~~~~REQUEST TYPES~~~~~~~~~~~~~~~~//
export type BunnyRequest = Request & Record<string, unknown>;

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

// ~~~~~~~~~~~~~~~CLASS METADATA TYPES~~~~~~~~~~~~~~~~//

export type ModuleMetadata = {
  controllers?: ClassConstructor[];
  providers?: (ClassConstructor | ProviderOptions)[];
};
export type CoreModuleMetadata = {
  modules: ClassConstructor[];
};
//~~~~~~~~~~~~~~~ROUTER METADATA TYPES~~~~~~~~~~~~~~~~//

export type RouteMetadata = {
  method: RequestMethod;
  path: string;
  handlerName: string;
};
export type RoutesMetadataArray = RouteMetadata[];

//~~~~~~~~~~~~~~~PARAMS METADATA TYPES~~~~~~~~~~~~~~~~//

export type BodyParamsMetadata = { index: number; name?: string }[];
export type ParamsMetadata = { index: number; name: string }[];

//~~~~~~~~~~~~~~~OTHER~~~~~~~~~~~~~~~~//

export type ClassConstructor<T = any> = new (...args: any[]) => T;
export type Token = string | symbol | InjectionToken<any>;
export type ProviderOptions = {
  provide: Token;
  useClass: ClassConstructor;
};
export class InjectionToken<T> {
  constructor(public name: string) {}
}
//~~~~~~~~~~~~~~~MIDDLEWARE~~~~~~~~~~~~~~~~//

export type Middleware = (req: BunnyRequest, next: (req: BunnyRequest) => Promise<Response> | Response) => Response | Promise<Response>;
