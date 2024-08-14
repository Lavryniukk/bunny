import { describe, test, expect } from 'bun:test';
import { Body } from '../../decorators';
import { BodyParamsMetadataKey } from '../../constants';
describe('BodyDecorator', () => {
  class Tmp {
    method(@Body() bob: string) {}

    method2(@Body('name') bob: string) {}
  }
  test('should have metadata', () => {
    const metadata = Reflect.getMetadata(BodyParamsMetadataKey, Tmp.prototype, 'method');
    expect(metadata).toEqual([{ index: 0, name: undefined }]);
  });

  test('should have metadata with name', () => {
    const metadata = Reflect.getMetadata(BodyParamsMetadataKey, Tmp.prototype, 'method2');
    expect(metadata).toEqual([{ index: 0, name: 'name' }]);
  });
});
