import {
  BunnyRequest,
  GuardsMetadata,
  HttpRequestHandler,
  HttpRequestHandlerMethod,
} from '@bunny-ts/common';
import { DependencyContainer } from 'core';
export type Middleware = (
  req: BunnyRequest,
  next: (req: BunnyRequest) => Promise<Response> | Response
) => Response | Promise<Response>;

export class MiddlewareFactory {
  dc: DependencyContainer;
  middlewares: Middleware[] = [];
  constructor(readonly depContainer: DependencyContainer) {
    this.dc = depContainer;
  }
  addMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  async applyMiddleware(
    req: Request,
    handlerData: HttpRequestHandler
  ): Promise<Response> {
    const { handler, controllerToken, handlerName } = handlerData;
    const controllerInstance = this.dc.resolve(controllerToken);
    let i = 0;
    const next = (request: BunnyRequest): Response | Promise<Response> => {
      if (i === this.middlewares.length) {
        return handler(request);
      }
      const middleware = this.middlewares[i];
      i++;
      return middleware(request, next);
    };
    const guardsMetadata: GuardsMetadata = Reflect.getMetadata(
      'guards',
      controllerInstance as Object,
      handlerName
    );
    console.log(guardsMetadata);

    const response: Response = await next(req as BunnyRequest);
    return response;
  }
}
