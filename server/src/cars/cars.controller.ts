import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  UseGuards, Req, UseInterceptors, UploadedFiles,
  BadRequestException
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CarsService } from './cars.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

// MUST be outside the class
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalName = `${uniqueSuffix}${extname(file.originalname)}`;
    console.log('Multer saving file as:', finalName);
    callback(null, finalName);
  },
});

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
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage, // ← CRITICAL: must pass the storage object
      fileFilter: (req, file, cb) => {
        console.log('Multer received file:', file.originalname, file.mimetype);
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(new BadRequestException('Only image files allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    })
  )
  async createCar(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() req: any
  ) {
    console.log('=== UPLOAD DEBUG ===');
    console.log('Files received:', files);
    console.log('Files length:', files?.length);
    console.log('First file:', files?.[0]);
    console.log('Body:', body);

    const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Safe mapping with null checks
    const imageUrls = (files || []).map((file, i) => {
      console.log(`File ${i}:`, { filename: file?.filename, path: file?.path, originalname: file?.originalname });
      if (!file?.filename) {
        console.error(`ERROR: file ${i} has no filename!`);
        return null;
      }
      return `${BASE_URL}/uploads/${file.filename}`;
    }).filter(Boolean); // remove nulls

    console.log('Final imageUrls:', imageUrls);

    const carData = {
      ...body,
      images: imageUrls,
      price: parseFloat(body.price),
      mileage: parseInt(body.mileage, 10),
      year: parseInt(body.year, 10),
    };

    const created = await this.carsService.create(carData, req.user.id);

    return {
      success: true,
      message: 'Listing created successfully',
      images: imageUrls,
      data: created,
    };
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
@Get('fix-images')
async fixBrokenImages() {
  const cars = await this.carsService.findAll({});
  let fixed = 0;
  for (const car of cars) {
    if (car.images?.some((img: string) => !img || img.includes('undefined'))) {
      car.images = [];
      // seller may be a partial object without an id property; prefer explicit sellerId fallback
      const sellerId = (car as any).seller?.id ?? (car as any).sellerId;
      await this.carsService.update((car as any).id, { images: [] }, sellerId);
      fixed++;
    }
  }
  return { message: `Fixed ${fixed} cars` };
}
  
}