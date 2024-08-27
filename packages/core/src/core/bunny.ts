import { DependencyContainer } from '.';
import 'reflect-metadata';
import { MiddlewareFactory, Middleware } from '../middleware';
import { Router } from 'router';
import { ClassConstructor, RequestMethod } from '@bunny-ts/common';
import { ModuleProcessor } from './module-processor';
import { json } from '../response';

export class Bunny {
  private readonly router: Router;
  private readonly middlewareFactory: MiddlewareFactory;
  private readonly processor: ModuleProcessor;
  private readonly diContainer: DependencyContainer;
  constructor(ModuleClass: ClassConstructor) {
    console.clear();
    console.log('Starting server, wait please...');
    this.diContainer = new DependencyContainer();
    this.router = new Router();
    this.processor = new ModuleProcessor(this.diContainer, this.router);
    this.middlewareFactory = new MiddlewareFactory(this.diContainer);
    this.processor.processCoreModule(ModuleClass);
  }

  listen(port: number = 8000, callback: () => void = () => {}) {
    Bun.serve({
      port,
      fetch: async (req) => {
        const path = new URL(req.url).pathname;
        const handler = this.router.getHandler(path, req.method as RequestMethod);
        if (handler) {
          return await this.middlewareFactory.applyMiddleware(req, handler);
        }
        return json({ message: 'Not found', status: 404 }, { status: 404 });
      },
    });

    callback();
  }

  addMiddleware(middleware: Middleware) {
    this.middlewareFactory.addMiddleware(middleware);
  }
}
