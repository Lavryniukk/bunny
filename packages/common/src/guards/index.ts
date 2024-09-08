import { ClassConstructor, Guard, GuardsMetadata } from 'types';
export const Guards = (guards: ClassConstructor<Guard>[]): MethodDecorator => {
  return (target, propertyKey, _) => {
    const payload: GuardsMetadata = {
      guards,
      handlerName: propertyKey.toString(),
    };
    Reflect.defineMetadata('guards', payload, target.constructor, propertyKey);
  };
};
