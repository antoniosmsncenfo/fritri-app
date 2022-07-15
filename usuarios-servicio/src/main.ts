import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  if (!fs.existsSync(`${process.env.UPLOADS_FOLDER}uploads`)){
    fs.mkdirSync(`${process.env.UPLOADS_FOLDER}uploads`);
  }
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
