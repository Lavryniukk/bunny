import { GuardsMetadata, ClassConstructor } from 'types';
export function Guards(guards: ClassConstructor[]): MethodDecorator {
  return (target, propertyKey, _) => {
    const payload: GuardsMetadata = {
      guards,
      handlerName: propertyKey.toString(),
    };
    Reflect.defineMetadata('guards', payload, target, propertyKey);
  };
}
