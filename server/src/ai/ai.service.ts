import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    // Initializes the OpenAI SDK with the key from your .env file
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeCarListing(carId: string) {
    // 1. Fetch the car details from the database
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }

    // 2. Draft an analytical context prompt optimized for market data evaluation
    const prompt = `
      You are an expert automotive market analyst. Analyze the following vehicle listing details:
      - Make: ${car.make}
      - Model: ${car.model}
      - Year: ${car.year}
      - Mileage: ${car.mileage} km
      - Listed Price: KES ${car.price}
      - Location: ${car.location}
      - Description: ${car.description}

      Provide a comprehensive valuation profile. Estimate a realistic market average price for this vehicle in the local regional context. 
      Determine if the listed price is a "GREAT_DEAL", "FAIR_PRICE", or "OVERPRICED".
      Calculate a demand score from 0 to 100 (where 100 means high buyer inquiry velocity).
      Write a compelling, professional, 3-sentence editorial summary highlighting the key selling points of this specific listing.

      You must return your response strictly as a JSON object matching this exact TypeScript structure:
      {
        "fairPriceScore": "GREAT_DEAL" | "FAIR_PRICE" | "OVERPRICED",
        "marketAveragePrice": number,
        "demandScore": number,
        "aiSummary": string
      }
    `;

    try {
      // 3. Request a structured JSON completion from OpenAI
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Cost-effective, high-speed model perfect for structured workflows
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2, // Kept low for consistent, data-driven analytical outputs
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      // 4. Save or update the intelligence profile in the database
      const intelligence = await this.prisma.listingIntelligence.upsert({
        where: { carId: car.id },
        update: {
          fairPriceScore: result.fairPriceScore,
          marketAveragePrice: result.marketAveragePrice,
          demandScore: result.demandScore,
          aiSummary: result.aiSummary,
          priceHistory: {
            updates: [
              { timestamp: new Date().toISOString(), price: car.price }
            ]
          }
        },
        create: {
          carId: car.id,
          fairPriceScore: result.fairPriceScore,
          marketAveragePrice: result.marketAveragePrice,
          demandScore: result.demandScore,
          aiSummary: result.aiSummary,
          priceHistory: {
            updates: [
              { timestamp: new Date().toISOString(), price: car.price }
            ]
          }
        },
      });

      return intelligence;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`AI Engine failed to compute valuation: ${errorMessage}`);
    }
  }
}