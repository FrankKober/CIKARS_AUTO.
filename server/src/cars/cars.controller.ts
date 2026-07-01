import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FilesInterceptor('images', 10)) // Allows up to 10 files
  async createCar(
    @UploadedFiles() files: any[], 
    @Body() body: any, 
    @Req() req: any
  ) {
    // Convert file objects into a list of paths or URLs
    // Note: If you use a cloud provider like S3, replace this with the actual URL
    const imageUrls = files.map(file => `/uploads/${file.filename}`);
    
    // Merge the image URLs with the other form data
    const carData = { ...body, images: imageUrls };
    
    return this.carsService.create(carData, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  // Optional: Add Interceptor here if you want to allow updating images
  async updateCar(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.carsService.update(id, body, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCar(@Param('id') id: string, @Req() req: any) {
    return this.carsService.remove(id, req.user.id);
  }
}