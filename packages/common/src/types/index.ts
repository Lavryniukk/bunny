// ~~~~~~~~~~~~~~~REQUEST TYPES~~~~~~~~~~~~~~~~//
export type BunnyRequest = Request & Record<string, unknown>;

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type HttpRequestHandler = {
  method: RequestMethod;
  handlerName: string;
  handler: HttpRequestHandlerMethod;
  path: string;
  controllerToken: InjectionToken<any>;
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
//~~~~~~~~~~~~~~~METHOD METADATA TYPES~~~~~~~~~~~~~~~~//

export interface Guard {
  canActivate: (req: Request) => boolean;
}
export type GuardsMetadata = {
  guards: ClassConstructor[];
  handlerName: string;
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

/**
 * Represents a unique identifier for a class.
 */
export type Token = string | symbol | InjectionToken<any>;
export type ProviderOptions = {
  provide: Token;
  useClass: ClassConstructor;
};
export class InjectionToken<T> {
  constructor(public name: string) {}
}
//~~~~~~~~~~~~~~~MIDDLEWARE~~~~~~~~~~~~~~~~//
