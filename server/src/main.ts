import { HttpExceptionFilter } from './api/http-exception.filter';
const io = require('@pm2/io')

io.init({
  metrics: {
    network: {
      ports: true
    }
  }
});

import * as express from 'express';
import * as passport from 'passport';
import * as session from 'express-session';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';

const config = require('../config/config.json');
const conString = process.env.DATABASE_URL || (config.postgreSqlStore && config.postgreSqlStore.development);
const PostgreSqlStore = require('connect-pg-simple')(session);


const SERVER_PORT = process.env.PORT || 3000;
const CLIENT_FILES = join(__dirname, '..', '..', 'client', 'dist');
const SESSION_HOURS_EXPIRED = 12, MINUTES_IN_HOURS = 60, SECONDS_IN_MINUTES = 60;
const sessionHoursExpired = parseInt(process.env.SESSION_HOURS_EXPIRED) || SESSION_HOURS_EXPIRED;
const cookieExpires = new Date(Date.now() + (sessionHoursExpired * MINUTES_IN_HOURS * SECONDS_IN_MINUTES * 1000))

// console.log(process.argv);

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.use(session({
    secret: process.env.SESSION_SECRET_KEY || 'secret-key',
    name: 'mobile_cash_desk_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: cookieExpires,
      maxAge: cookieExpires
    },
    store: conString ? new PostgreSqlStore({ conString }) : null
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(CLIENT_FILES));
  app.useGlobalFilters(new HttpExceptionFilter());
  
  const options = new DocumentBuilder()
    .setTitle('Mobile Cash Desk API')
    .setDescription('The API for mobile apps that uses for Mobile Cash Desk process')
    .setVersion('1.0')
    // .setBasePath('api')
    .addBearerAuth('Authorization', 'header')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(SERVER_PORT);
}
bootstrap();
