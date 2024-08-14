import { describe, test, expect } from 'bun:test';

import { CoreModule } from '../../decorators';
import { CoremoduleMetadataKey } from '../../constants';

describe('CoreModule Decorator', () => {
  @CoreModule({
    providers: [],
    controllers: [],
    modules: [],
  })
  class Tmp {}

  test('should have metadata', () => {
    const metadata = Reflect.getMetadata(CoremoduleMetadataKey, Tmp);
    expect(metadata).toEqual({ providers: [], controllers: [], modules: [] });
  });
});
