import { ModuleMetadata, ClassConstructor, InjectionToken } from '../types';
import { INJECTION_TOKEN_MK, ModuleMetadataKey } from '../constants';

export function Module(metadata: ModuleMetadata) {
  return function (target: ClassConstructor) {
    const processedProviders = metadata.providers?.map((provider) => {
      if (typeof provider === 'function') {
        const token = Reflect.getMetadata(INJECTION_TOKEN_MK, provider) || new InjectionToken(provider.name);
        return {
          provide: token,
          useClass: provider,
        };
      }
      return provider;
    });

    const processedMetadata: ModuleMetadata = {
      ...metadata,
      providers: processedProviders,
    };

    Reflect.defineMetadata(ModuleMetadataKey, processedMetadata, target);
  };
}
