import { DependencyContainer } from './core';
import { Router } from './router';
import { ClassConstructor, CoreModuleMetadata, ModuleMetadata } from './types';

export class Bunny {
  private readonly router: Router;
  private readonly container: DependencyContainer;

  constructor(ModuleClass: ClassConstructor) {
    this.container = new DependencyContainer();
    this.router = new Router(this.container);

    this.processCoreModule(ModuleClass);
  }

  private processModule(ModuleClass: ClassConstructor) {
    const metadata: ModuleMetadata = Reflect.getMetadata('module:metadata', ModuleClass) || {};
    const { controllers = [], providers = [] } = metadata;

    providers.forEach((provider) => {
      this.container.register(provider);
    });

    controllers.forEach((controller) => {
      this.router.registerController(controller);
      this.container.register(controller);
    });
  }

  private processCoreModule(CoreModuleClass: ClassConstructor) {
    const metadata: CoreModuleMetadata = Reflect.getMetadata('coremodule:metadata', CoreModuleClass) || {};
    const { controllers = [], providers = [], modules = [] } = metadata;

    providers.forEach(this.container.register);

    controllers.forEach((controller) => {
      this.router.registerController(controller);
      this.container.register(controller);
    });

    modules.forEach((module) => {
      this.processModule(module);
    });
  }

  listen(port: number = 8000, callback: () => void = () => {}) {
    Bun.serve({
      port,
      fetch: async (req) => {
        const path = new URL(req.url).pathname;
        const handler = this.router.getHandler(path, req.method);
        if (handler) {
          return handler(req);
        }
        return new Response('Page not found', { status: 404 });
      },
    });

    callback();
  }
}
