
import 'reflect-metadata';
export const Injectable = (): ClassDecorator => {
  return function (target: any) {
    Reflect.defineMetadata('injectable', true, target);
  };
};
