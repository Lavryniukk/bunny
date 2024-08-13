import { describe, test, expect } from 'bun:test';
import { Param } from '../../decorators';
describe('Param Decorator', () => {
  class Tmp {
    method(@Param('id') param: string) {}
  }

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata('parameters', Tmp.prototype, 'method');
    expect(metadata).toEqual([{ index: 0, name: 'id' }]);
  });
});
