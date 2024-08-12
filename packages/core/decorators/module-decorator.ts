
import {ModuleMetadata, ClassConstructor} from '../types'
import 'reflect-metadata';
export function Module(metadata: ModuleMetadata) {
  return function (target: ClassConstructor) {
    Reflect.defineMetadata('module:metadata', metadata, target);
  };
}
