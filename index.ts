import { Constructor, DependencyContainer } from './core';
import { Router } from './router';

export class Bunny {
  private readonly router: Router;
  private readonly container: DependencyContainer;

  constructor(ModuleClass: Constructor) {
    this.container = new DependencyContainer();
    this.router = new Router(this.container);

    this.processModule(ModuleClass);
  }

  private processModule(ModuleClass: Constructor) {
    const metadata = Reflect.getMetadata('module:metadata', ModuleClass) || {};
    const { controllers = [], providers = [] } = metadata;

    // Register providers
    providers.forEach((provider) => {
      this.container.register(provider);
    });

    // Register controllers and their routes
    controllers.forEach((controller) => {
      this.router.registerController(controller);
      this.container.register(controller);
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
