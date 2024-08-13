import 'reflect-metadata';
import { ClassConstructor } from '../types';

export class DependencyContainer {
  public dependencies: Map<string, any> = new Map();

  register<T>(target: ClassConstructor<T>): void {
    if (!target) {
      console.error('Cannot register a null target');
    }
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    if (!this.dependencies) {
      console.error('Something really strange happened, dependencies is null');
    }
    const injections = tokens.map((token: ClassConstructor) => this.resolve<any>(token));

    const instance = new target(...injections);
    const name = target.name;
    this.dependencies.set(name, instance);
  }

  resolve<T>(target: ClassConstructor<T>): T {
    if (!this.dependencies) {
      console.error('Something really strange happened, dependencies is null');
    }
    const name = target.name;
    if (!this.dependencies.has(name)) {
      this.register(target);
    }
    return this.dependencies.get(name);
  }

  registerAll(services: ClassConstructor[]): void {
    services.forEach((service) => this.register(service));
  }
}
