import { describe, test, expect, beforeEach, spyOn, Mock } from 'bun:test';
import { RequestParameterParser } from 'request';
import { BodyParamsMetadata, ParamsMetadata, RouteMetadata } from 'types';

describe('RequestParameterParser', () => {
  const routeMetadata: RouteMetadata[] = [
    {
      path: '/volvo/:id',
      handlerName: 'handler',
      method: 'GET',
    },
    {
      path: '/volvo',
      handlerName: 'handler',
      method: 'POST',
    },
    {
      path: '/volvo/:id',
      handlerName: 'handler',
      method: 'POST',
    },
  ];
  const mockQueryParamsMetadata: ParamsMetadata = [{ index: 0, name: 'id' }];
  const mockBodyParamsMetadata: BodyParamsMetadata = [{ index: 1 }];
  let req: Request;
  let RPP: RequestParameterParser;
  let bodyMetadataSpy: Mock<any>;
  let paramMetadataSpy: Mock<any>;
  const controller = { constructor: { prototype: {} } };
  beforeEach(() => {
    req = new Request('https://cobold.com/volvo/someVolvoId', { body: JSON.stringify({ name: 'volvo' }) });
    RPP = new RequestParameterParser(controller);
    bodyMetadataSpy = spyOn(RPP, 'getBodyParamsMetadata');
    paramMetadataSpy = spyOn(RPP, 'getQueryParamsMetadata');
  });
  describe('parseParams', () => {
    test('should return the params from the request', () => {
      const params = RPP.parseParams(req, routeMetadata[0]);

      expect(params).toEqual({ id: 'someVolvoId' });
    });

    test("should return empty object if there's no params", () => {
      const params = RPP.parseParams(req, routeMetadata[1]);

      expect(params).toEqual({});
    });
  });
  describe('parseRequestParams', () => {
    test('should return the params(query) from the request', async () => {
      bodyMetadataSpy.mockReturnValue(mockBodyParamsMetadata);
      paramMetadataSpy.mockReturnValue(mockQueryParamsMetadata);

      const params = await RPP.parseRequestParams(req, routeMetadata[0]);

      expect(params).toEqual(['someVolvoId']);
    });

    test('should return the params(body) from the request', async () => {
      bodyMetadataSpy.mockReturnValue(mockBodyParamsMetadata);
      paramMetadataSpy.mockReturnValue(mockQueryParamsMetadata);

      const params = await RPP.parseRequestParams(req, routeMetadata[1]);

      expect(params).toEqual([, { name: 'volvo' }]);
    });
    test('should return the params(body and query) from the request', async () => {
      bodyMetadataSpy.mockReturnValue(mockBodyParamsMetadata);
      paramMetadataSpy.mockReturnValue(mockQueryParamsMetadata);

      const params = await RPP.parseRequestParams(req, routeMetadata[2]);
      expect(params).toEqual(['someVolvoId', { name: 'volvo' }]);
    });
  });
});
