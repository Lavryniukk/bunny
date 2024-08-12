
import {CoreModuleMetadata, ClassConstructor} from "../types"
import 'reflect-metadata';
export function CoreModule(metadata: CoreModuleMetadata) {
  return function (target: ClassConstructor) {
    if (Reflect.hasMetadata('coremodule:metadata', target)) {
      throw new Error('You have used core module more then once');
    }
    Reflect.defineMetadata('coremodule:metadata', metadata, target);
  };
}
