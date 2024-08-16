import {
  CoremoduleMetadataKey,
  INJECTION_TOKEN_MK,
  ModuleMetadataKey,
} from '../constants';
import { Router } from 'router';
import { ClassConstructor, CoreModuleMetadata, ModuleMetadata } from 'types';
import { DependencyContainer } from './dependency-container';

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
        DependencyContainer.createToken(provider.name);
        this.container.register(token, provider);
      }
    });

    controllers.forEach((controller) => {
      const token = this.getInjectionMetadata(controller);
      DependencyContainer.createToken(controller.name);
      this.container.register(token, controller);
      this.router.registerController(controller, token);
    });
  }

  public getInjectionMetadata(classConstructor: ClassConstructor) {
    return Reflect.getMetadata(INJECTION_TOKEN_MK, classConstructor);
  }

  public processCoreModule(ModuleClass: ClassConstructor) {
    const metadata: CoreModuleMetadata =
      Reflect.getMetadata(CoremoduleMetadataKey, ModuleClass) || {};
    const modules = metadata.modules || [];
    modules.forEach((module) => {
      this.processModule(module);
    });
  }
}
