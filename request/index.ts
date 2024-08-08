import { BodyParamsMetadata, ParamsMetadata, RouteMetadata } from '../types';

export const parseRequestParams = async (req: Request, routeMetadata: RouteMetadata, service: any): Promise<any[]> => {
  const { handlerName } = routeMetadata;
  let methodParameters: any[] = [];

  if (req.method !== 'GET') {
    const body = await req.json();
    const bodyParametersMetadata = await parseBodyParams(handlerName, service);
    bodyParametersMetadata.map(({ index, name }) => {
      methodParameters[index] = name ? body[name] : body;
    });
  }

  const parametersMetadata: ParamsMetadata =
    Reflect.getOwnMetadata('parameters', service.constructor.prototype, routeMetadata.handlerName) || [];
  if (parametersMetadata.length > 0) {
    const foundParams = parseParams(req, routeMetadata, service);
    parametersMetadata.map((paramMetadata) => {
      methodParameters[paramMetadata.index] = foundParams[paramMetadata.name];
    });
  }

  return methodParameters;
};

const parseBodyParams = async (handlerName: string, service: any): Promise<BodyParamsMetadata> => {
  return Reflect.getOwnMetadata('body_parameters', service.constructor.prototype, handlerName) || [];
};

export const parseParams = (req: Request, routeMetadata: RouteMetadata, service: any): Record<string, any> => {
  const { pathname } = new URL(req.url);
  let params: Record<string, any> = {};

  const routeChunks = routeMetadata.path.split('/');
  const urlChunks = pathname.split('/');

  if (routeChunks.length !== urlChunks.length) {
    return {};
  }

  for (let i = 0; i < routeChunks.length; i++) {
    const routeChunk = routeChunks[i];
    const urlChunk = urlChunks[i];

    if (routeChunk.startsWith(':')) {
      params[routeChunk.slice(1)] = urlChunk;
      continue;
    }

    if (routeChunk !== urlChunk) {
      return {};
    }
  }

  return params;
};
