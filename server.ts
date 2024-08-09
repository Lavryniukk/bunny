import { Bunny } from '.';
import { CoreAppModule } from './big.module';

const bunny = new Bunny(CoreAppModule);

bunny.listen(8000, () => {
  console.log('Server started on 8000');
});
