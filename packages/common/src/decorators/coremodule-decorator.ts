import { CoremoduleMetadataKey } from '../constants';
import { CoreModuleMetadata } from '../types';
export function CoreModule(metadata: CoreModuleMetadata): ClassDecorator {
  return function (target) {
    if (Reflect.hasMetadata(CoremoduleMetadataKey, target)) {
      throw new Error('You have used core module more then once');
    }
    Reflect.defineMetadata(CoremoduleMetadataKey, metadata, target);
  };
}
