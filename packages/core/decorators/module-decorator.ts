import { ModuleMetadataKey } from '../constants';
import { ModuleMetadata, ClassConstructor } from '../types';
import 'reflect-metadata';
export function Module(metadata: ModuleMetadata) {
  return function (target: ClassConstructor) {
    Reflect.defineMetadata(ModuleMetadataKey, metadata, target);
  };
}
