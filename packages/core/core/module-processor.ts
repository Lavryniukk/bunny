import { ModuleMetadataKey, CoremoduleMetadataKey } from "constants";
import { Router } from "router";
import { ClassConstructor, ModuleMetadata, CoreModuleMetadata } from "types";
import { DependencyContainer } from "./dependency-container";

export class ModuleProcessor {
  private container: DependencyContainer;
  private router: Router;

  constructor(diContainer: DependencyContainer, router: Router) {
    this.container = diContainer;
    this.router = router;
  }

  public processModule(ModuleClass: ClassConstructor) {
    const metadata: ModuleMetadata = Reflect.getMetadata(ModuleMetadataKey, ModuleClass) || {};
    const { controllers = [], providers = [] } = metadata;
    
    providers.forEach(provider => {
      const token = this.container.createToken(provider.name);
      this.container.register(token, provider);
    });

    controllers.forEach((controller) => {
      const token = this.container.createToken(controller.name);
      this.container.register(token, controller);
      this.router.registerController(controller, token);
    });
  }

  public processCoreModule(CoreModuleClass: ClassConstructor) {
    const metadata: CoreModuleMetadata = Reflect.getMetadata(CoremoduleMetadataKey, CoreModuleClass) || {};
    const { controllers = [], providers = [], modules = [] } = metadata;
    
    modules.forEach((module) => {
      this.processModule(module);
    });

    providers.forEach(provider => {
      const token = this.container.createToken(provider.name);
      this.container.register(token, provider);
    });

    controllers.forEach((controller) => {
      const token = this.container.createToken(controller.name);
      this.container.register(token, controller);
      this.router.registerController(controller, token);
    });
  }
}
