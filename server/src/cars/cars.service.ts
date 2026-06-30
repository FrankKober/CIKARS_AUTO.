import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AiService } from '../ai/ai.service.js';

@Injectable()
export class CarsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(carData: any, sellerId: string) {
    // 1. Process images: Convert comma-separated string to Array if needed
    const imageArray = Array.isArray(carData.images) 
      ? carData.images 
      : (carData.images ? carData.images.split(',').map((s: string) => s.trim()) : []);

    const car = await this.prisma.car.create({
      data: {
        make: carData.make,
        model: carData.model,
        transmission: carData.transmission,
        vin: carData.vin,
        description: carData.description,
        images: imageArray, // Stored as String[] in PostgreSQL
        year: Number(carData.year),
        mileage: Number(carData.mileage),
        price: Number(carData.price),
        fuelType: String(carData.fuelType),
        location: carData.location || "Nairobi",
        sellerId: sellerId,
      },
    });

    try {
      this.openaiAnalysisInBackground(car.id);
    } catch (error: any) {
      console.error(`Failed to trigger AI background task for car ${car.id}:`, error.message);
    }

    return car;
  }

  private async openaiAnalysisInBackground(carId: string) {
    this.aiService.analyzeCarListing(carId).catch((err) => {
      console.error(`Async AI computation exception: ${err.message}`);
    });
  }

  async findAll(filters: { make?: string; model?: string; location?: string; minPrice?: string; maxPrice?: string }) {
    const { make, model, location, minPrice, maxPrice } = filters;

    // Fetching all relevant fields including the 'images' array
    return this.prisma.car.findMany({
    include: {
      seller: { select: { name: true, verified: true } },
      intelligence: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

  async findOne(id: string) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        intelligence: true,
        seller: {
          select: { name: true, email: true, verified: true },
        },
      },
    });

    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return car;
  }

  async update(id: string, carData: any, userId: string) {
    const car = await this.findOne(id);
    if (car.sellerId !== userId) throw new ForbiddenException('You can only modify your own listings');

    return this.prisma.car.update({
      where: { id },
      data: {
        ...carData,
        images: carData.images ? (Array.isArray(carData.images) ? carData.images : carData.images.split(',').map((s: string) => s.trim())) : undefined,
        year: carData.year ? Number(carData.year) : undefined,
        mileage: carData.mileage ? Number(carData.mileage) : undefined,
        price: carData.price ? Number(carData.price) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const car = await this.findOne(id);
    if (car.sellerId !== userId) throw new ForbiddenException('You can only delete your own listings');

    await this.prisma.car.delete({ where: { id } });
    return { message: 'Listing successfully removed' };
  }
}