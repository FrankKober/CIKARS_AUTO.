import { config } from 'dotenv';
config(); // ← MUST be before everything else

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: [
      'https://cikars-auto-z3l8-2ncnrkmlg-676866s-projects.vercel.app', // Matches your current screenshot URL
      'http://localhost:3000', // For local development testing if needed
    ],
    credentials: true,
  });

  // Use process.env.PORT provided by Render, fallback to 3001 locally
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();