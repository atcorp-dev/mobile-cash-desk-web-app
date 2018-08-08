import * as express from 'express';
import { join }  from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';

const SERVER_PORT = process.env.PORT || 3000;
const CLIENT_FILES = join(__dirname, '..', '..', 'client', 'dist');

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
  app.use(express.static(CLIENT_FILES));
  
  const options = new DocumentBuilder()
    .setTitle('Mobile Cash Desk API')
    .setDescription('The API for mobile apps that uses for Mobile Cash Desk process')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

	await app.listen(SERVER_PORT);
}
bootstrap();
