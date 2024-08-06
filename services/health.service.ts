import { Get } from "../decorators";

export class HealthService {
  @Get("/check")
  check() {
    return new Response("OK", { status: 200 });
  }
}
