import 'reflect-metadata';
import {
  BunnyRequest,
  ForbiddenException,
  GuardsMetadata,
  HttpRequestHandler,
} from '@bunny-ts/common';
import { DependencyContainer } from 'core';
import { error } from 'response';
export type Middleware = (
  req: BunnyRequest,
  next: (req: BunnyRequest) => Promise<Response> | Response
) => Response | Promise<Response>;

export class MiddlewareFactory {
  dc: DependencyContainer;
  middlewares: Middleware[] = [];
  constructor(depContainer: DependencyContainer) {
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
    const controller = this.dc.resolve<any>(controllerToken);
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
      controller.constructor,
      handlerName
    );
    const isAllowed = guardsMetadata.guards.every((GuardConstructor) => {
      const guard = new GuardConstructor();
      return guard.canActivate(req);
    });
    if (!isAllowed) {
      return error(new ForbiddenException());
    }

    const response: Response = await next(req as BunnyRequest);
    return response;
  }
}
