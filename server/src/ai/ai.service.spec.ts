import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async generateCarIntelligence(carData: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    location: string;
  }) {
    if (!process.env.OPENAI_API_KEY) {
      throw new InternalServerErrorException("OPENAI_API_KEY is not configured.");
    }

    const prompt = `
      Analyze the following car listing and output a strict JSON object (no markdown formatting outside JSON):
      - Car: ${carData.year} ${carData.make} ${carData.model}
      - Listed Price: KES ${carData.price}
      - Mileage: ${carData.mileage} km
      - Location: ${carData.location}

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
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error("OpenAI Generation Error:", error);
      throw new InternalServerErrorException("Failed to generate AI valuation.");
    }
  }
}