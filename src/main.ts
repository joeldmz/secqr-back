import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { GlobaHttpExceptionsFilter } from './filter/global-errors.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //exception-filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobaHttpExceptionsFilter(httpAdapter));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
