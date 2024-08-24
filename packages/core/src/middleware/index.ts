import { BunnyRequest, HttpRequestHandlerMethod } from '@bunny-ts/common';
export type Middleware = (
  req: BunnyRequest,
  next: (req: BunnyRequest) => Promise<Response> | Response
) => Response | Promise<Response>;

export class MiddlewareFactory {
  middlewares: Middleware[] = [];

  addMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  applyMiddleware(
    req: Request,
    handler: HttpRequestHandlerMethod
  ): Response | Promise<Response> {
    let i = 0;
    const next = (request: BunnyRequest): Response | Promise<Response> => {
      if (i === this.middlewares.length) {
        return handler(request);
      }
      const middleware = this.middlewares[i];
      i++;
      return middleware(request, next);
    };
    return next(req as BunnyRequest);
  }
}
