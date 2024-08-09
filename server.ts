import { Bunny } from '.';
import { AppModule } from './big.module';

const bunny = new Bunny(AppModule);

bunny.listen(8000, () => {
  console.log('Server started on 8000');
});
