import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';

// const httpsOptions = {
//   key: fs.readFileSync('D:/localhost_ssl/dev.ajanuw.com.key'),
//   cert: fs.readFileSync('D:/localhost_ssl/dev.ajanuw.com.crt'),
// };
const globalPrefix = 'api';
const port = process.env.port || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // httpsOptions,
  });

  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: '*',
    credentials: true
  });
  await app.listen(port, () => {
    console.log(`http://localhost:${port}/api/hello`);
  });
}

bootstrap();
