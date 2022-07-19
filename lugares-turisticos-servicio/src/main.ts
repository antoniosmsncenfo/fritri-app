import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*Configuaración del Swagger*/
  const config = new DocumentBuilder()
    .setTitle('Servicio de lugares turísticos')
    .setDescription(
      'API para la obtención de lugares turisticos, utilizando Google como proveedor de información',
    )
    .setVersion('1.0')
    .addTag('Endpoints', 'Endpoints disponibles para el consumo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  ); //Agrega validaciones para los endpoint

  await app.listen(parseInt(process.env.PORT));

  Logger.log(`Servicio de lugares turísticos iniciado`, 'INFO');
  Logger.log(`Escuchando el puerto: ${process.env.PORT}`, 'INFO');
  Logger.log(
    `Documentación en la dirección: http://127.0.0.1:${process.env.PORT}/api`,
    'SWAGGER',
  );
}

bootstrap();
