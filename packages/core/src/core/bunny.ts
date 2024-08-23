import { DependencyContainer } from '.';
import 'reflect-metadata';
import { MiddlewareFactory } from '../middleware';
import { Router } from 'router';
import { ClassConstructor, Middleware, RequestMethod } from '../types';
import { ModuleProcessor } from './module-processor';

export class Bunny {
  private readonly router: Router;
  private readonly middlewareFactory: MiddlewareFactory;
  private readonly processor: ModuleProcessor;
  private readonly diContainer: DependencyContainer;
  constructor(ModuleClass: ClassConstructor) {
    console.clear();
    console.log('Starting server...');
    this.diContainer = new DependencyContainer();
    this.router = new Router(this.diContainer);
    this.processor = new ModuleProcessor(this.diContainer, this.router);
    this.middlewareFactory = new MiddlewareFactory();
    this.processor.processCoreModule(ModuleClass);
  }

  listen(port: number = 8000, callback: () => void = () => {}) {
    Bun.serve({
      port,
      fetch: async (req) => {
        const path = new URL(req.url).pathname;
        const handler = this.router.getHandler(path, req.method as RequestMethod);
        if (handler) {
          return this.middlewareFactory.applyMiddleware(req, handler);
        }
        return Response.json({ message: 'Not found' }, { status: 404 });
      },
    });

    callback();
  }

  addMiddleware(middleware: Middleware) {
    this.middlewareFactory.addMiddleware(middleware);
  }
}
