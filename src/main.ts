import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 5000;

  await app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
}
bootstrap();
