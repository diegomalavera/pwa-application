import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { join } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(
    session({
      secret: '26a6c46d53c935c4c5b5d9e49d412336b976814b934516a2cb32f3f6f824b8ad',
      resave: false,
      saveUninitialized: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
