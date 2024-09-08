import { Router } from 'router';
import { DependencyContainer } from './dependency-container';
import {
  ClassConstructor,
  ModuleMetadata,
  ModuleMetadataKey,
  INJECTION_TOKEN_MK,
  CoreModuleMetadata,
  CoremoduleMetadataKey,
} from '@bunny-ts/common';

export class ModuleProcessor {
  private container: DependencyContainer;
  private router: Router;

  constructor(diContainer: DependencyContainer, router: Router) {
    this.container = diContainer;
    this.router = router;
  }

  public processModule(ModuleClass: ClassConstructor) {
    const metadata: ModuleMetadata =
      Reflect.getMetadata(ModuleMetadataKey, ModuleClass) || {};
    const { controllers = [], providers = [] } = metadata;

    providers.forEach((provider) => {
      if ('provide' in provider) {
        this.container.register(provider.provide, provider.useClass);
      } else {
        const token = this.getInjectionMetadata(provider);
        this.container.register(token, provider);
      }
    });

    controllers.forEach((controller) => {
      const token = this.getInjectionMetadata(controller);
      this.container.register(token, controller);

      const controllerInstance = this.container.resolve(token);
      this.router.registerController(controllerInstance, token);
    });
  }

  public getInjectionMetadata(classConstructor: ClassConstructor) {
    return Reflect.getMetadata(INJECTION_TOKEN_MK, classConstructor);
  }

  public processCoreModule(CoremoduleClass: ClassConstructor) {
    const metadata: CoreModuleMetadata =
      Reflect.getMetadata(CoremoduleMetadataKey, CoremoduleClass) || {};
    const modules = metadata.modules || [];
    modules.forEach((module) => {
      this.processModule(module);
    });
  }
}
