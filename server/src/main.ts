
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow your Next.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/headers
  });

  // Run the backend on port 3001 to avoid conflicting with Next.js
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  
  console.log(`🚀 API Server is running on: http://localhost:${PORT}`);
}
bootstrap();