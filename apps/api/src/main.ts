import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import 'dotenv/config';
import multipart from '@fastify/multipart';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.register(multipart);
  app.enableCors(); // Enable CORS for client-side access
  await app.listen(process.env.API_PORT ?? 4000, '0.0.0.0'); // Listen on all interfaces
  console.log(`API Application is running on ${await app.getUrl()}`);
}
bootstrap();
