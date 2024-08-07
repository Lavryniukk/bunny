import { RouteMetadata } from '../types';

export const parseRequestParams = async (req: Request, routeMetadata: RouteMetadata, service: any): Promise<any[]> => {
  const { handlerName } = routeMetadata;
  let methodParameters: any[] = [];

  if (req.method !== 'GET') {
    const body = await req.json();

    const bodyParameters = await parseBodyParams(handlerName, service);

    bodyParameters.forEach(({ index, name }) => {
      methodParameters[index] = name ? body[name] : body;
    });
  }

  return methodParameters;
};

const parseBodyParams = async (handlerName: string, service: any) => {
  const bodyParameters: { index: number; name?: string }[] =
    Reflect.getOwnMetadata('body_parameters', service.constructor.prototype, handlerName) || [];
  return bodyParameters;
};

export const parseParams = (path: string, routePath: string): Record<string, string> => {
  const pathParts = path.split('/');
  const routeParts = routePath.split('/');

  const params: Record<string, string> = {};

  routeParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[i];
    }
  });

  return params;
};
