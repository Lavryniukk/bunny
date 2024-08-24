import {
  RouteMetadata,
  BodyParamsMetadata,
  BodyParamsMetadataKey,
  ParamsMetadata,
  QueryParamsMetadataKey,
} from '@bunny-ts/common';

export class RequestParameterParser {
  constructor(private readonly controller: any) {}

  public async parseRequestParams(
    req: Request,
    routeMetadata: RouteMetadata
  ): Promise<any[]> {
    const { handlerName, method } = routeMetadata;
    const methodParameters: any[] = [];

    if (method !== 'GET') {
      await this.parseBodyParameters(req, handlerName, methodParameters);
    }

    await this.parseQueryParameters(req, routeMetadata, methodParameters);

    return methodParameters;
  }

  async parseBodyParameters(
    req: Request,
    handlerName: string,
    methodParameters: any[]
  ): Promise<void> {
    const body = await req.json();
    const bodyParametersMetadata = this.getBodyParamsMetadata(handlerName);

    bodyParametersMetadata.forEach(({ index, name }) => {
      methodParameters[index] = name ? body[name] : body;
    });
  }

  async parseQueryParameters(
    req: Request,
    routeMetadata: RouteMetadata,
    methodParameters: any[]
  ): Promise<void> {
    const parametersMetadata = this.getQueryParamsMetadata(
      routeMetadata.handlerName
    );

    if (parametersMetadata.length > 0) {
      const foundParams = this.parseParams(req, routeMetadata);
      parametersMetadata.forEach((paramMetadata) => {
        methodParameters[paramMetadata.index] = foundParams[paramMetadata.name];
      });
    }
  }

  getBodyParamsMetadata(handlerName: string): BodyParamsMetadata {
    return (
      Reflect.getOwnMetadata(
        BodyParamsMetadataKey,
        this.controller.constructor.prototype,
        handlerName
      ) || []
    );
  }

  getQueryParamsMetadata(handlerName: string): ParamsMetadata {
    return (
      Reflect.getOwnMetadata(
        QueryParamsMetadataKey,
        this.controller.constructor.prototype,
        handlerName
      ) || []
    );
  }

  parseParams(req: Request, routeMetadata: RouteMetadata): Record<string, string> {
    const { pathname } = new URL(req.url);
    const routeChunks = routeMetadata.path.split('/');
    const urlChunks = pathname.split('/');

    if (routeChunks.length !== urlChunks.length) {
      return {};
    }

    const params: Record<string, string> = {};

    for (let i = 0; i < routeChunks.length; i++) {
      const routeChunk = routeChunks[i];
      const urlChunk = urlChunks[i];

      if (routeChunk.startsWith(':')) {
        params[routeChunk.slice(1)] = urlChunk;
      } else if (routeChunk !== urlChunk) {
        return {};
      }
    }

    return params;
  }
}
