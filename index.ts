import { Router } from './router';

export class Bunny {
  private readonly router: Router;
  constructor() {
    this.router = new Router();
  }

  listen(port: number = 8000, callback: () => void = () => {}) {
    Bun.serve({
      port,

      fetch: async (req) => {
        const path = new URL(req.url).pathname;
        const handler = this.router.getDynamicHandler(path, req.method);
        if (handler) {
          return handler(req);
        }

        return new Response('Page not found', { status: 404 });
      },
    });

    callback();
  }

  addService(service: any) {
    this.router.addService(service);
  }
}
