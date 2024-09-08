import { CoremoduleMetadataKey } from '../constants';
import { CoreModuleMetadata, ClassConstructor } from '../types';
export function CoreModule(metadata: CoreModuleMetadata) {
  return function (target: ClassConstructor) {
    if (Reflect.hasMetadata(CoremoduleMetadataKey, target)) {
      throw new Error('You have used core module more then once');
    }
    Reflect.defineMetadata(CoremoduleMetadataKey, metadata, target);
  };
}
