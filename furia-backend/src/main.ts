import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  const uploadPath = join(__dirname, '../uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Uploads directory created:', uploadPath);
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.API_URL],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS', 'UPDATE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    credentials: true,
    maxAge: 3600,
  });

  await app.listen(3000);
}
bootstrap();
