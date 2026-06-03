import { Module } from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { CarsController } from './cars.controller.js';
import { AiModule } from '../ai/ai.module.js'; // Import the AI module

@Module({
  imports: [AiModule], // Injected here
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}