import  { BunnyRequest, HttpRequestHandlerMethod, type Middleware} from '../types';

export class MiddlewareFactory {

  middlewares: Middleware[] = [];

  addMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware);
  }
  
  applyMiddleware(req:Request, handler: HttpRequestHandlerMethod): Response  | Promise<Response>{
    let i = 0;
    const next  = (request: BunnyRequest): Response | Promise<Response> => {
     if(i === this.middlewares.length){
       return handler(request); 
      }
      const middleware = this.middlewares[i];
      i++;
      return middleware(request,next)
    }
    return next(req as BunnyRequest);
  }
}
