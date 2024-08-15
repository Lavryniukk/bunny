import { ModuleMetadata, ClassConstructor } from '../types';
import 'reflect-metadata';
import { ModuleMetadataKey } from '../constants';
import { DependencyContainer } from 'core';

export function Module(metadata: ModuleMetadata) {
  return function (target: ClassConstructor) {
    const processedProviders = metadata.providers?.map((provider) => {
      if (typeof provider === 'function') {
        const token = Reflect.getMetadata('injectionToken', provider) || DependencyContainer.createToken(provider.name);
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
