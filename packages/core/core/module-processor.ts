import { DependencyContainer } from '.';
import { Router } from '../router';
import { ClassConstructor, ModuleMetadata, CoreModuleMetadata } from '../types';
import 'reflect-metadata';

export class ModuleProcessor {
  private container: DependencyContainer;
  private router:Router
  constructor(diContainer: DependencyContainer, router: Router) {
    this.container = diContainer;
    this.router = router;
  }

  public processModule(ModuleClass: ClassConstructor) {
    const metadata: ModuleMetadata = Reflect.getMetadata('module:metadata', ModuleClass) || {};
    const { controllers = [], providers = [] } = metadata;

    providers.forEach(this.container.register);

    controllers.forEach((controller) => {
      this.router.registerController(controller);
      this.container.register(controller);
    });
  }

  public processCoreModule(CoreModuleClass: ClassConstructor) {
    const metadata: CoreModuleMetadata = Reflect.getMetadata('coremodule:metadata', CoreModuleClass) || {};
    const { controllers = [], providers = [], modules = [] } = metadata;

    providers.forEach(this.container.register);

    controllers.forEach((controller) => {
      this.router.registerController(controller);
      this.container.register(controller);
    });

    modules.forEach((module) => {
      this.processModule(module);
    });
  }
}
