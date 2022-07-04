import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  //await app.listen(process.env.PORT);
=======
>>>>>>> develop
  await app.listen(3000);
}
bootstrap();
