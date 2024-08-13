import { describe, test, expect } from 'bun:test';

import { CoreModule } from '../../decorators';

describe('CoreModule Decorator', () => {
  @CoreModule({
    providers: [],
    controllers: [],
    modules: [],
  })
  class Tmp {}

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata('coremodule:metadata', Tmp);
    expect(metadata).toEqual({ providers: [], controllers: [], modules: [] });
  });
});
