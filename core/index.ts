import 'reflect-metadata';

export type Constructor<T = any> = new (...args: any[]) => T;

export class DependencyContainer {
  private dependencies: Map<string, any> = new Map();

  register<T>(target: Constructor<T>): void {
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map((token: Constructor) => this.resolve<any>(token));

    const instance = new target(...injections);
    const name = target.name;
    this.dependencies.set(name, instance);
  }

  resolve<T>(target: Constructor<T>): T {
    const name = target.name;
    if (!this.dependencies.has(name)) {
      this.register(target);
    }
    return this.dependencies.get(name);
  }

  registerAll(services: Constructor[]): void {
    services.forEach((service) => this.register(service));
  }
}
