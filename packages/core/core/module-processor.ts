import { CoremoduleMetadataKey, ModuleMetadataKey } from '../constants';
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
        const token =
          Reflect.getMetadata('injectionToken', provider) ||
          DependencyContainer.createToken(provider.name);
        this.container.register(token, provider);
      }
    });

    controllers.forEach((controller) => {
      const token =
        Reflect.getMetadata('injectionToken', controller) ||
        DependencyContainer.createToken(controller.name);
      this.container.register(token, controller);
      this.router.registerController(controller, token);
    });
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
