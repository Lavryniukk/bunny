import { GuardsMetadata, Guard } from 'types';
export function Guards(guards: Guard[]): MethodDecorator {
  return (target, propertyKey, _) => {
    const payload: GuardsMetadata = {
      guards,
      handlerName: propertyKey.toString(),
    };
    Reflect.defineMetadata('guards', payload, target, propertyKey);
  };
}
