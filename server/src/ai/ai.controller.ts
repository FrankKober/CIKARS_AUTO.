import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze/:carId')
  @HttpCode(HttpStatus.OK)
  async analyzeCar(@Param('carId') carId: string) {
    return this.aiService.analyzeCarListing(carId);
  }
}