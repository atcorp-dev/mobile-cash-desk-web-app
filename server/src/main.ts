import * as express from 'express';
import { join }  from 'path';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';

const SERVER_PORT = process.env.PORT || 3000;
const CLIENT_FILES = join(__dirname, '..', '..', 'client', 'dist');

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	app.use(express.static(CLIENT_FILES));
	await app.listen(SERVER_PORT);
}
bootstrap();
