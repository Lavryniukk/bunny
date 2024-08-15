import { ControllerMetadataKey, InjectableMetadataKey } from '../constants';
import 'reflect-metadata';
import { ClassConstructor } from 'types';

export class DependencyContainer {
  public dependencies: Map<string, any> = new Map();

  register<T>(target: ClassConstructor<T>): void {
    if (!target) {
      console.error('Cannot register a null target');
    }
    const injectable = Reflect.getMetadata(InjectableMetadataKey, target);
    const controller = Reflect.getMetadata(ControllerMetadataKey, target);
    console.log('Registering: ', target.name, ' as ' + (injectable ? 'Injectable' : 'Controller'));
    const tokens = Reflect.getMetadata('design:paramtypes', target) || [];
    const injections = tokens.map((token: ClassConstructor) => this.resolve<any>(token));

    const instance = new target(...injections);
    const name = target.name;
    this.dependencies.set(name, instance);
  }

  resolve<T>(target: ClassConstructor<T> | string): T {
    const name = typeof target === 'string' ? target : target.name;
    console.log('Resolving: ', name);
    if (!this.dependencies.has(name)) {
      if (typeof target === 'string') {
        throw new Error(`No provider for ${name}`);
      }
      this.register(target);
    }
    return this.dependencies.get(name);
  }
  registerAll(services: ClassConstructor[]): void {
    services.forEach((service) => this.register(service));
  }
}
