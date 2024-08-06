import { Router } from "./router";
import { HealthService } from "./services/health.service";

const router = new Router();
const healthService = new HealthService();

router.addService(healthService);

const server = Bun.serve({
  async fetch(req) {
    const path = new URL(req.url).pathname;
    const handler = router.getHandler(path);

    if (handler) {
      return handler(req);
    }

    return new Response("Page not found", { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
