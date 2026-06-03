import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CarsService } from './cars.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async getAllCars(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  async getCarById(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCar(@Body() body: any, @Req() req: any) {
    // req.user is populated dynamically by the JwtStrategy validation step
    return this.carsService.create(body, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCar(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.carsService.update(id, body, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCar(@Param('id') id: string, @Req() req: any) {
    return this.carsService.remove(id, req.user.id);
  }
}