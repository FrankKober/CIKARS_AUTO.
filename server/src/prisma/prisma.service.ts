import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined. Check your .env file.');
    }

    // Fix: Remove channel_binding (breaks pg driver) and ensure clean URL
    const cleanUrl = connectionString
      .replace(/&?channel_binding=[^&]*/g, '')
      .replace(/\?&/, '?')
      .replace(/\?$/, '');

    const pool = new Pool({ connectionString: cleanUrl });
    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Successfully connected to the database!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}