import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY not set. AI analysis will return fallback data.');
    }
  }

  /**
   * Helper method matching direct raw data generation if needed elsewhere
   */
  async generateCarIntelligence(carData: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    location: string;
    description?: string;
  }) {
    if (!this.openai) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const prompt = `
      Analyze the following car listing and output a strict JSON object (no markdown formatting outside JSON):
      - Car: ${carData.year} ${carData.make} ${carData.model}
      - Listed Price: KES ${carData.price}
      - Mileage: ${carData.mileage} km
      - Location: ${carData.location}
      - Description: ${carData.description || 'N/A'}

      Provide:
      1. "fairPriceScore": exact string match of either "GREAT_DEAL", "FAIR_PRICE", or "OVERPRICED"
      2. "marketAveragePrice": estimated number in KES
      3. "demandScore": integer between 0 and 100 based on popularity in Kenya
      4. "aiSummary": a short 2-sentence professional market valuation summary.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error("OpenAI Generation Error:", errorMessage);
      throw new Error("Failed to generate AI valuation.");
    }
  }

  /**
   * Main controller method used by AiController to analyze and upsert database intelligence
   */
  async analyzeCarListing(carId: string) {
    // 1. Fetch the car details
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${carId} not found`);
    }

    // 2. If no OpenAI key, return fallback data immediately
    if (!this.openai) {
      this.logger.warn(`Returning fallback AI data for car ${carId}`);
      return this.prisma.listingIntelligence.upsert({
        where: { carId: car.id },
        update: {
          fairPriceScore: 'FAIR_PRICE',
          marketAveragePrice: car.price,
          demandScore: 50,
          aiSummary: 'AI analysis unavailable. Set OPENAI_API_KEY to enable smart valuations.',
          priceHistory: {
            updates: [{ timestamp: new Date().toISOString(), price: car.price }],
          },
        },
        create: {
          carId: car.id,
          fairPriceScore: 'FAIR_PRICE',
          marketAveragePrice: car.price,
          demandScore: 50,
          aiSummary: 'AI analysis unavailable. Set OPENAI_API_KEY to enable smart valuations.',
          priceHistory: {
            updates: [{ timestamp: new Date().toISOString(), price: car.price }],
          },
        },
      });
    }

    // 3. Draft the prompt
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
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return this.prisma.listingIntelligence.upsert({
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`AI Engine failed for car ${carId}: ${errorMessage}`);
      
      // Return fallback instead of crashing
      return this.prisma.listingIntelligence.upsert({
        where: { carId: car.id },
        update: {
          fairPriceScore: 'FAIR_PRICE',
          marketAveragePrice: car.price,
          demandScore: 50,
          aiSummary: 'AI analysis temporarily unavailable.',
          priceHistory: {
            updates: [{ timestamp: new Date().toISOString(), price: car.price }],
          },
        },
        create: {
          carId: car.id,
          fairPriceScore: 'FAIR_PRICE',
          marketAveragePrice: car.price,
          demandScore: 50,
          aiSummary: 'AI analysis temporarily unavailable.',
          priceHistory: {
            updates: [{ timestamp: new Date().toISOString(), price: car.price }],
          },
        },
      });
    }
  }
}