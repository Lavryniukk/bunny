import { Bunny,  } from '.';
import { CoreAppModule } from './big.module';
import { type Middleware } from './types';
const bunny = new Bunny(CoreAppModule);
const middleware: Middleware = (req,next) => {
  req["cock"] = req.headers;
  return next( req );
}
bunny.addMiddleware(middleware);
bunny.listen(8000, () => {
  console.log('Server started on 8000');
})
